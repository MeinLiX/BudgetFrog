using Microsoft.EntityFrameworkCore;

using BudgetFrogServer.Models.ER_Basis;

namespace BudgetFrogServer.Models
{
    public class DB_ExchangeRatesContext : DbContext
    {
        public virtual DbSet<Currency> Сurrency { get; set; }

        public DB_ExchangeRatesContext(DbContextOptions<DB_ExchangeRatesContext> options) : base(options)
        {
            //Database.EnsureDeleted();
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CurencyRelationship>()
           .HasKey(t => new { t.FirstCurrencyID, t.SecondCurrencyID });

            modelBuilder.Entity<CurencyRelationship>()
            .HasOne(er => er.FirstCurrency)
            .WithMany(cur => cur.FirstCurencyRelationship)
            .HasForeignKey(er => er.FirstCurrencyID)
            .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<CurencyRelationship>()
            .HasOne(er => er.SecondCurrency)
            .WithMany(cur => cur.SecondCurencyRelationship)
            .HasForeignKey(er => er.SecondCurrencyID)
            .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<Currency>()
                .HasData(
                    new { ID = 1, Name = "USD" },
                    new { ID = 2, Name = "EUR" },
                    new { ID = 3, Name = "UAH" },
                    new { ID = 4, Name = "RUB" }
                );
        }

    }
}