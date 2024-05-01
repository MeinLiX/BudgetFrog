using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.VisualBasic;
using System.Runtime.CompilerServices;
using System.Text.Json;
using WepApi.Models.Externals.MonobankApi;
using WepApi.Utils;
using WepApi.Utils.Exceptions;

namespace WepApi.Features.Services
{
    public class MonobankApiService(IMemoryCache memoryCache, ILogger<MonobankApiService> logger)
    {
        private readonly IMemoryCache memoryCache = memoryCache;
        private Uri GetUrl(string endPoint) => new($"https://api.monobank.ua/{endPoint}");

        private HttpClient Client { get; } = new();
        private readonly ILogger<MonobankApiService> logger = logger;

        //don't look inside class. Quick hand made cache
        //Чорт голову зломить
        private class MemClientInfo
        {
            //Month1-month2
            public static KeyValuePair<long, long> CurrentFromTo = GetFromToToday();

            public DateTime LatestClientInfoDatetime { get; set; } = DateTime.Now.AddSeconds(-61);
            private ClientInfoResponse latestClientInfoResponse;
            public ClientInfoResponse LatestClientInfoResponse
            {
                get => latestClientInfoResponse; set
                {
                    latestClientInfoResponse = value;
                    LatestClientInfoDatetime = DateTime.Now;
                }
            }

            // key pair<month,year>
            public Dictionary<KeyValuePair<long, long>, StatementResponseCached> LatestStatementResponse = new Dictionary<KeyValuePair<long, long>, StatementResponseCached>();

            public StatementResponseCached? GetCached(long from, long to)
                => LatestStatementResponse.TryGetValue(new KeyValuePair<long, long>(from, to), out var statementResponseCached)
                    ? statementResponseCached
                    : statementResponseCached;


            public MemClientInfo UpdateOrCreateAndFill(long from, long to, List<StatementResponse> latestStatementResponse)
            {
                StatementResponseCached? src = GetCached(from, to);

                var fromTo = new KeyValuePair<long, long>(from, to);
                src ??= new StatementResponseCached(fromTo);
                src.Update(latestStatementResponse);

                if (LatestStatementResponse.Remove(fromTo)) { };

                LatestStatementResponse.Add(fromTo, src);


                return this;
            }

            public class StatementResponseCached(long from, long to)
            {
                public readonly bool NeedUpdate = from >= CurrentFromTo.Key && to >= CurrentFromTo.Value;

                public DateTime LatestStatementResponseDatetime { get; set; } = DateTime.Now.AddSeconds(-61);

                private List<StatementResponse> latestStatementResponse = [];
                public List<StatementResponse> LatestStatementResponse
                {
                    get => latestStatementResponse; private set
                    {
                        latestStatementResponse = value;
                        LatestStatementResponseDatetime = DateTime.Now;
                    }
                }

                public StatementResponseCached(KeyValuePair<long, long> fromTo) : this(fromTo.Key, fromTo.Value) { }

                public StatementResponseCached Update(List<StatementResponse> responses)
                {
                    LatestStatementResponse = responses;
                    return this;
                }
            }
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="token"></param>
        /// <param name="forceupdate">Request to monobank api every 60sec when true</param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<ClientInfoResponse> GetClientInfo(string token, bool forceupdate = true)
        {
            try
            {
                if (memoryCache.TryGetValue(token, out MemClientInfo? clientInfo))
                {
                    if (clientInfo is not null && clientInfo.LatestClientInfoResponse is not null)
                    {
                        //Return when lower 60 sec last response or if not force always return last response
                        if (!forceupdate || AppUtil.DateExpired(clientInfo.LatestClientInfoDatetime, TimeSpan.FromSeconds(61))) { return clientInfo.LatestClientInfoResponse; }
                    }
                }

                HttpRequestMessage httpRequest = new()
                {
                    Method = HttpMethod.Get,
                    RequestUri = GetUrl("personal/client-info"),
                };

                httpRequest.Headers.Add("X-Token", token);


                HttpResponseMessage response = await Client.SendAsync(httpRequest);
                string responseContext = await response.Content.ReadAsStringAsync();
                var res = JsonSerializer.Deserialize<ClientInfoResponse>(responseContext) ?? throw new AppException("Response empty");

                clientInfo ??= new MemClientInfo();
                clientInfo.LatestClientInfoResponse = res;
                memoryCache.Set(token, clientInfo);

                return res;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw;
            }
        }

        //Todo if list => 500, while send request for append list (last date in transaction replace 'to' date)
        public async Task<List<StatementResponse>> GetStatement(string token, string account, long from, long to)
        {
            if (from > MemClientInfo.CurrentFromTo.Key && to > MemClientInfo.CurrentFromTo.Value)
            { return []; }

            if (string.IsNullOrEmpty(account))
            {
                account = "0";
            }

            try
            {
                if (memoryCache.TryGetValue(token, out MemClientInfo? clientInfo))
                {
                    if (clientInfo is not null)
                    {
                        var cache = clientInfo.GetCached(from, to);
                        if (cache != null)
                        {
                            //Return when lower 60 sec last response or if statement old our month
                            if (!cache.NeedUpdate || AppUtil.DateExpired(cache.LatestStatementResponseDatetime, TimeSpan.FromSeconds(61)))
                                return cache.LatestStatementResponse;
                        }
                    }
                }
                HttpRequestMessage httpRequest = new()
                {
                    Method = HttpMethod.Get,
                    RequestUri = GetUrl($"personal/statement/{account}/{from}/{to}"),
                };

                httpRequest.Headers.Add("X-Token", token);

                HttpResponseMessage response = await Client.SendAsync(httpRequest);
                string responseContext = await response.Content.ReadAsStringAsync();
                List<StatementResponse> res = [];
                try
                {
                    res = JsonSerializer.Deserialize<List<StatementResponse>>(responseContext) ?? throw new AppException("Response empty");
                }
                catch (Exception e)
                {
                    var rErr = JsonSerializer.Deserialize<Dictionary<string, string>>(responseContext);
                    var errRes = rErr["errorDescription"];
                    throw new AppException("Monobank: " + errRes, statusCode: System.Net.HttpStatusCode.TooManyRequests);
                }

                clientInfo ??= new MemClientInfo();
                clientInfo = clientInfo.UpdateOrCreateAndFill(from, to, res);
                memoryCache.Set(token, clientInfo);

                return res;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw;
            }
        }

        //public async Task<List<StatementResponse>> GetStatement(string token, string account = "0") => await GetStatement(token, account, DateTimeOffset.UtcNow.AddDays(-31).ToUnixTimeSeconds(), DateTimeOffset.UtcNow.ToUnixTimeSeconds());
        public async Task<List<StatementResponse>> GetStatement(string token, string account, int month, int year)
        {
            var firstDayOfMonth = new DateTime(year, month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddSeconds(-1);

            return await GetStatement(token,
                                      account,
                                      from: ((DateTimeOffset)DateTime.SpecifyKind(firstDayOfMonth, DateTimeKind.Utc)).ToUnixTimeSeconds(),
                                      to: ((DateTimeOffset)DateTime.SpecifyKind(lastDayOfMonth, DateTimeKind.Utc)).ToUnixTimeSeconds());
        }

        public static KeyValuePair<long, long> GetFromToToday()
        {
            var today = DateTime.Now;
            var firstDayOfMonth = new DateTime(today.Year, today.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddSeconds(-1);

            return new KeyValuePair<long, long>(((DateTimeOffset)DateTime.SpecifyKind(firstDayOfMonth, DateTimeKind.Utc)).ToUnixTimeSeconds(),
                                                ((DateTimeOffset)DateTime.SpecifyKind(lastDayOfMonth, DateTimeKind.Utc)).ToUnixTimeSeconds());
        }
    }
}
