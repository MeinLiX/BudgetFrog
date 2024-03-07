using Microsoft.Extensions.Logging;
using System.Text.Json;
using WepApi.Context;
using WepApi.Context.Interfaces;
using WepApi.Models.FastForex;

namespace WepApi.Features.HostedService;

public class ExchangeRatesFFUpdaterHostedService : IHostedService
{
    private Timer _timer;
    private readonly TimeSpan _periodTime;
    private readonly IExchangeRateContext _ER_context;
    private readonly HttpClient _client = new();
    private readonly string _api_key;
    private readonly Uri _uri;
    private readonly ILogger logger;

    public ExchangeRatesFFUpdaterHostedService(IServiceProvider serviceProvider, IConfiguration configuration)
    {
        var sp = serviceProvider.CreateScope().ServiceProvider;
        
        _ER_context = sp.GetRequiredService<ExchangeRateContext>();
        _periodTime = TimeSpan.FromMinutes(double.Parse(configuration["FastForex:UpdateIntervalMinutes"]));
        _api_key = configuration["FastForex:ApiKey"];
        _uri = new Uri($"https://api.fastforex.io/fetch-all?from=USD&api_key={_api_key}");
        this.logger = sp.GetRequiredService<ILogger<ExchangeRatesFFUpdaterHostedService>>();
    }

    private async void DoWork(object state)
    {
        try
        {
            var response = await _client.GetAsync(_uri.AbsoluteUri);
            var stringContent = await response.Content.ReadAsStringAsync();

            var responseModel = JsonSerializer.Deserialize<FFbase>(stringContent);

            if (responseModel is null || responseModel.@base is null)
            {
                logger.LogError("FastForex token is expired. Exchange Rates not updated.");
                return;
            }

            FFbase newER = new()
            {
                @base = responseModel.@base,
                results = responseModel.results,
                updated = responseModel.updated,
                ms = responseModel.ms
            };

            _ER_context.FFbase.Add(newER);
            await _ER_context.SaveChangesAsync();
        }
        catch { }
    }

    public Task StartAsync(CancellationToken ct)
    {
        _timer = new Timer(DoWork, null, TimeSpan.Zero, _periodTime);
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
