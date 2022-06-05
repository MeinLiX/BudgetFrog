using WepApi.Models.FastForex;

namespace WepApi.Context.Interfaces;

public interface IExchangeRateContext
{
    DbSet<FFbase> FFbase { get; set; }
    DbSet<FFresult> FFresult { get; set; }

    Task<int> SaveChangesAsync();
}
