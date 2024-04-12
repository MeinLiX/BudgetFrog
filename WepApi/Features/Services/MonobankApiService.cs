using Microsoft.Extensions.Caching.Memory;
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

        private class MemClientInfo
        {
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

            public DateTime LatestStatementResponseDatetime { get; set; } = DateTime.Now.AddSeconds(-61);

            private List<StatementResponse> latestStatementResponse;
            public List<StatementResponse> LatestStatementResponse
            {
                get => latestStatementResponse; set
                {
                    latestStatementResponse = value;
                    LatestStatementResponseDatetime = DateTime.Now;
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
            if (string.IsNullOrEmpty(account))
            {
                account = "0";
            }

            try
            {
                if (memoryCache.TryGetValue(token, out MemClientInfo? clientInfo))
                {
                    if (clientInfo is not null && clientInfo.LatestStatementResponse is not null)
                    {
                        //Return when lower 60 sec last response
                        if (AppUtil.DateExpired(clientInfo.LatestClientInfoDatetime, TimeSpan.FromSeconds(61))) { return clientInfo.LatestStatementResponse; }
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
                var res = JsonSerializer.Deserialize<List<StatementResponse>>(responseContext) ?? throw new AppException("Response empty");

                clientInfo ??= new MemClientInfo();
                clientInfo.LatestStatementResponse = res;
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
    }
}
