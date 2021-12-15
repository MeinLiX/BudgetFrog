using Microsoft.EntityFrameworkCore;
using WepApi.Models.Common;

namespace WepApi.Models.Budgets;

public static class TransactionDescriptionBuilder
{
    public static void BuildTransactionDescription(this ModelBuilder MB)
    {
        MB.BuildModelBase<TransactionDescription>();

        MB.Entity<TransactionDescription>()
          .Property(td => td.Date)
          .HasColumnType("DATE")
          .IsRequired();

        MB.Entity<TransactionDescription>()
          .Property(td => td.Notes)
          .HasColumnType("TEXT");

        MB.Entity<TransactionDescription>()
          .Property(td => td.RecepitUrl)
          .HasColumnType("TEXT");
    }
}
