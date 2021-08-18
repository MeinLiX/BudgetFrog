using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using BudgetFrogServer.Models;
using System.Linq;
using BudgetFrogServer.Models.ER_Basis;

namespace BudgetFrogServer.Services
{
    public class ExchangeRatesUpdater : IHostedService
    {
        private TimeSpan periodTime = TimeSpan.FromMinutes(1);
        private Timer _timer;
        private readonly DB_ExchangeRatesContext _ER_context;
        private readonly HttpClient client = new();
        private readonly Uri uri = new("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5");

        public ExchangeRatesUpdater(IServiceProvider serviceProvider)
        {
            _ER_context = serviceProvider.CreateScope().ServiceProvider.GetRequiredService<DB_ExchangeRatesContext>();
        }

        private async void DoWork(object state)
        {
            var response = await client.GetAsync(uri.AbsoluteUri);
            var stringContent = await response.Content.ReadAsStringAsync();
            var currencies = _ER_context.Сurrency.ToList();

            var responseModel = JsonSerializer.Deserialize<List<CcyModel>>(stringContent);
            responseModel.ForEach(ccy =>
            {
                if (ccy.ccy == "RUR")
                    ccy.ccy = "RUB";

                var firstcurr = currencies.FirstOrDefault(cr => cr.Name == ccy.ccy);
                var secondcurr = currencies.FirstOrDefault(cr => cr.Name == ccy.base_ccy);
                if (firstcurr is not null && secondcurr is not null)
                {
                    var fcr = firstcurr.FirstCurencyRelationship.FirstOrDefault(cr => cr.SecondCurrency == secondcurr);
                    if (fcr is null)
                    {
                        firstcurr.FirstCurencyRelationship.Add(new CurencyRelationship() { FirstCurrency = firstcurr, SecondCurrency = secondcurr, Relation = ccy.Relation });
                    }
                    else
                    {
                        fcr.Relation = ccy.Relation;
                        fcr.Date = DateTime.Now;
                    }
                }
            });

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

        private class CcyModel
        {
            public string ccy { get; set; }
            public string base_ccy { get; set; }
            public string buy { get; set; }
            public string sale { get; set; }

            [JsonIgnore]
            public double Relation => (double.Parse(buy) + double.Parse(sale)) / 2;
        }
    }
}

