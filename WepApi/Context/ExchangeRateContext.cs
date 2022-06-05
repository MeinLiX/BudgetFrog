using WepApi.Context.Interfaces;
using WepApi.Models.FastForex;

namespace WepApi.Context;

public class ExchangeRateContext : DbContext, IExchangeRateContext
{
    public ExchangeRateContext(DbContextOptions<ExchangeRateContext> options)
        : base(options)
    {
        //Database.EnsureDeleted();
        Database.EnsureCreated();
    }

    public DbSet<FFbase> FFbase { get; set; }
    public DbSet<FFresult> FFresult { get; set; }


    public async Task<int> SaveChangesAsync() => await base.SaveChangesAsync();
}
