using Microsoft.EntityFrameworkCore;

using BudgetFrogServer.Models.ER_Basis;

namespace BudgetFrogServer.Models
{
    public class DB_ExchangeRatesContext : DbContext
    {
        public virtual DbSet<ExchangeRates> ExchangeRates { get; set; }

        public DB_ExchangeRatesContext(DbContextOptions<DB_ExchangeRatesContext> options) : base(options)
        {
            Database.EnsureDeleted();
            Database.EnsureCreated();
        }

    }
}