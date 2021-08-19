using System;
using System.Threading;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text.Json;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using BudgetFrogServer.Models;
using BudgetFrogServer.Models.ER_Basis;
using System.Linq;

namespace BudgetFrogServer.Services
{
    public class ExchangeRatesUpdater : IHostedService
    {
        private TimeSpan periodTime = TimeSpan.FromMinutes(60);
        private Timer _timer;
        private readonly DB_ExchangeRatesContext _ER_context;
        private readonly HttpClient client = new();
        private readonly Uri uri = new("https://api.fastforex.io/fetch-all?from=USD&api_key=a81cd79963-b664094635-qy20m7");//trial api_key, nevermind

        public ExchangeRatesUpdater(IServiceProvider serviceProvider)
        {
            _ER_context = serviceProvider.CreateScope().ServiceProvider.GetRequiredService<DB_ExchangeRatesContext>();
        }

        private async void DoWork(object state)
        {
            var response = await client.GetAsync(uri.AbsoluteUri);
            var stringContent = await response.Content.ReadAsStringAsync();

            var responseModel = JsonSerializer.Deserialize<ExchangeRates>(stringContent);

            var newER = new ExchangeRates()
            {
                @base = responseModel.@base,
                results=responseModel.results,
                updated=responseModel.updated,
                ms=responseModel.ms
            };
            
            _ER_context.ExchangeRates.Add(newER);
            await _ER_context.SaveChangesAsync();
            
        }

        public Task StartAsync(CancellationToken ct)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, periodTime);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken ct)
        {
            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }

    }
}

