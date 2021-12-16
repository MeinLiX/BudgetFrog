using WepApi.Models.Common;

namespace WepApi.Models.Budgets;

public static class BalanceBuilder
{
    public static void BuildBalance(this ModelBuilder MB)
    {
        MB.BuildModelBase<Balance>();

        MB.Entity<Balance>()
          .Property(b => b.Amount)
          .HasColumnType("decimal(18,4)")
          .IsRequired();

        MB.Entity<Balance>()
          .Property(b => b.Currency)
          .HasColumnType("VARCHAR(3)") // USD\UAH\PLN\....\EUR
          .IsRequired();
    }
}
