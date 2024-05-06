using System.Text;
using System.Text.Json;
using WepApi.Models.Externals.Assistant;
using WepApi.Models.Transactions;

namespace WepApi.Features.Services
{
    public class OllamaService
    {
        private class OllamaApiClientCustom
        {
            private HttpClient Client { get; } = new();
            public string SelectedModel { get; set; }

            private Uri UriBase { get; set; }
            private Uri GetUrl(string endPoint) => new($"{UriBase}{endPoint}");

            public OllamaApiClientCustom(Uri uri)
            {
                UriBase = uri;
            }

            public async Task<AssistResponse> Request(string prompt)
            {

                var requestContent = new AssistRequest()
                {
                    model = SelectedModel,
                    prompt = prompt,
                    stream = false

                };

                HttpRequestMessage httpRequest = new()
                {
                    Method = HttpMethod.Post,
                    RequestUri = GetUrl("api/generate"),
                    Content = new StringContent(JsonSerializer.Serialize(requestContent), Encoding.UTF8, "application/json")
                };

                HttpResponseMessage response = await Client.SendAsync(httpRequest);
                string responseContext = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<AssistResponse>(responseContext)!;
            }
        }

        private readonly OllamaApiClientCustom OllamaClient;

        public OllamaService(IConfiguration configuration)
        {
            OllamaClient = new OllamaApiClientCustom(new Uri(configuration["Ollama:URL"]))
            {
                SelectedModel = configuration["Ollama:PreferModel"]
            };
        }

        private static string ConverTransactionListToMessageData(List<TransactionDescription> transactions)
        {
            string messagePrefix = "My dataset in current month: ";
            if (transactions.Count == 0) { return messagePrefix + "Not have data on this month."; }
            return $"{messagePrefix}[{string.Join(";", transactions.Select(t => t.GetSummary()))}]";//.Replace('"','\'');
        }

        public async Task<string> GetAnalysisCurrentMonth(List<TransactionDescription> transactions)
        {
            string prompt = "[transaction description in array in format: <amount>,<Category>,<Date>,<currency>;], Please {{analize}} my transaction in selected month (in {Hryvnia} Currency), say waht is good and bads, don't show statiscits, but show annomaly. array is: " + ConverTransactionListToMessageData(transactions);
            var res = await OllamaClient.Request(prompt);

            return res.response;
        }

    }
}
