using WepApi.Context.Interfaces;
using WepApi.Models.Budgets;
using WepApi.Models.FastForex;
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
    public async Task<Balance> ChangeCurrency(Balance bal, string to, DateTime date)
    {
        Balance balance = new() { Amount = bal.Amount, Currency = bal.Currency, ID = bal.ID };
        var exchangeRates = GetExchange(date);

        balance.Amount = exchangeRates.Convert(balance.Currency, to, balance.Amount);
        balance.Currency = to;

        return balance;
    }

    /// <summary>
    /// Change balance currency without db save.
    /// </summary>
    /// <returns>Balance with new currency and amount</returns>
    public async Task<Balance> ChangeCurrency(Guid id, string to, DateTime date)
    {
        var balance = _context.Balances.FirstOrDefault(b => b.ID == id);
        if (balance is null) throw new AppException("[Currency service] Balance not found.");

        return await ChangeCurrency(balance.ID, to, date);
    }

    /// <summary>
    /// Get exchange rate close to date.
    /// </summary>
    /// <param name="date">Date to clostest found exchange rate</param>
    /// <returns>exchange rate</returns>
    /// <exception cref="AppException">When exchange rate not found</exception>
    public FFbase GetExchange(DateTime dateExchange)
    {
        try
        {
            return _ER_context.FFbase
                              .Include(ffb=>ffb.results)
                              .ToList()
                              .OrderBy(ffb => TimeRange(dateExchange,ffb.date))
                              .First();
        }
        catch
        {
            throw new AppException("[Currency service] Exchange rates not found.");
        }
    }

    private static double TimeRange(DateTime dt1, DateTime dt2) => Math.Abs(Convert.ToDouble((dt1 - dt2).TotalMinutes.ToString()));
}
