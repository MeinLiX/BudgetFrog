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
            //TODO: fix crash and create  many-to-many relationships (Currency-CurrencyRealationship-Currency)
            //Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CurencyRelationship>()
           .HasKey(t => new { t.FirstCurrencyID, t.SecondCurrencyID });

            modelBuilder.Entity<CurencyRelationship>()
            .HasOne(er => er.FirstCurrency)
            .WithMany(cur => cur.FirstCurencyRelationship)
            .HasForeignKey(er => er.FirstCurrencyID);

            modelBuilder.Entity<CurencyRelationship>()
            .HasOne(er => er.SecondCurrency)
            .WithMany(cur => cur.SecondCurencyRelationship)
            .HasForeignKey(er => er.SecondCurrencyID);



            /* 
            modelBuilder
                .Entity<Currency>()
                .HasMany(currency => currency.Currencies)
                .WithMany(currency => currency.Currencies)
                .UsingEntity<ExchangeRate>(
                   j => j
                    .HasOne(exchangeRate => exchangeRate.FirstCurrency)
                    .WithMany(currency => currency.ExchangeRates)
                    .HasForeignKey(exchangeRate => exchangeRate.FirstCurrencyID),
                j => j
                    .HasOne(exchangeRate => exchangeRate.SecondCurrency)
                    .WithMany(currency => currency.ExchangeRates)
                    .HasForeignKey(exchangeRate => exchangeRate.SecondCurrencyID),
                j => j
                .ToTable("ExchangeRates")
                );
             */
        }

    }
}