using WepApi.Context.Interfaces;
using WepApi.Models.Budgets;
using WepApi.Utils.Exceptions;

namespace WepApi.Features.Services;

public class ExchangeRateService
{
    private readonly IBudgetAppContext _context;
    private readonly IExchangeRateContext _ER_context;

    public ExchangeRateService(IBudgetAppContext ctx, IExchangeRateContext ER_ctx)
    {
        _context = ctx;
        _ER_context = ER_ctx;
    }

    /// <summary>
    /// Change balance currency without db save.
    /// </summary>
    /// <returns>Balance with new currency and amount</returns>
    public async Task<Balance> ChangeCurrency(Balance bal,string to) 
        => await ChangeCurrency(bal.ID, to);

    /// <summary>
    /// Change balance currency without db save.
    /// </summary>
    /// <returns>Balance with new currency and amount</returns>
    public async Task<Balance> ChangeCurrency(Guid id, string to)
    {
        var balance = _context.Balances.FirstOrDefault(b => b.ID == id);
        if(balance is null) throw new AppException("[Currency service] Balance not found.");

        var exchangeRates = await _ER_context.FFbase
                                               .Include(er => er.results)
                                               .OrderByDescending(er => er.ID)
                                               .FirstOrDefaultAsync();
        if (exchangeRates is null) throw new AppException("[Currency service] Exchange rates not found.");

        balance.Amount = exchangeRates.Convert(balance.Currency, to, balance.Amount);
        balance.Currency = to;

        return balance;
    }
}
