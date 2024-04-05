using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;
using WepApi.Models.Externals.MonobankApi;
using WepApi.Utils;
using WepApi.Utils.Exceptions;

namespace WepApi.Features.Services
{
    public class MonobankApiService
    {
        private readonly IMemoryCache memoryCache;
        private Uri GetUrl(string endPoint) => new($"https://api.monobank.ua/{endPoint}");

        private HttpClient client { get; } = new();
        private readonly ILogger<MonobankApiService> logger;

        public MonobankApiService(IMemoryCache memoryCache, ILogger<MonobankApiService> logger)
        {
            this.memoryCache = memoryCache;
            this.logger = logger;
        }

        private class MemClientInfo
        {
            public DateTime LatestClientInfoDatetime { get; set; }
            public ClientInfoResponse LatestClientInfoResponse { get; set; }
            public MemClientInfo(ClientInfoResponse latestClientInfoResponse)
            {
                LatestClientInfoResponse = latestClientInfoResponse;
                LatestClientInfoDatetime = DateTime.Now;
                LatestStatementResponseDatetime = LatestClientInfoDatetime.AddSeconds(-61);
            }

            public DateTime LatestStatementResponseDatetime { get; set; }
            public List<StatementResponse> LatestStatementResponse { get; set; }

            public MemClientInfo(List<StatementResponse> latestStatementResponse)
            {
                LatestStatementResponse = latestStatementResponse;
                LatestStatementResponseDatetime = DateTime.Now;
                LatestClientInfoDatetime = LatestStatementResponseDatetime.AddSeconds(-61);
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
                if (memoryCache.TryGetValue(token, out MemClientInfo clientInfo))
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


                HttpResponseMessage response = await client.SendAsync(httpRequest);
                string responseContext = await response.Content.ReadAsStringAsync();
                var res = JsonSerializer.Deserialize<ClientInfoResponse>(responseContext) ?? throw new AppException("Response empty");

                memoryCache.Set(token, new MemClientInfo(res));

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
            try
            {
                HttpRequestMessage httpRequest = new()
                {
                    Method = HttpMethod.Get,
                    RequestUri = GetUrl($"personal/statement/{account}/{from}/{to}"),
                };

                httpRequest.Headers.Add("X-Token", token);

                HttpResponseMessage response = await client.SendAsync(httpRequest);
                string responseContext = await response.Content.ReadAsStringAsync();
                var res = JsonSerializer.Deserialize<List<StatementResponse>>(responseContext) ?? throw new AppException("Response empty");

                //memoryCache.Set(token, new MemClientInfo(res));

                return res;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw;
            }
        }

        public async Task<List<StatementResponse>> GetStatement(string token, string account = "0") => await GetStatement(token, account, DateTimeOffset.UtcNow.AddDays(-31).ToUnixTimeSeconds(), DateTimeOffset.UtcNow.ToUnixTimeSeconds());
    }
}
