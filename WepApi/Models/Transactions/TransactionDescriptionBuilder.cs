using WepApi.Models.Common;

namespace WepApi.Models.Transactions;

public static class TransactionDescriptionBuilder
{
    public static void BuildTransactionDescription(this ModelBuilder MB)
    {
        MB.BuildModelBase<TransactionDescription>();

        MB.Entity<TransactionDescription>()
          .Property(td => td.Date)
          .HasColumnType("timestamp")
          .IsRequired();

        MB.Entity<TransactionDescription>()
          .Property(td => td.Notes)
          .HasColumnType("TEXT");

        MB.Entity<TransactionDescription>()
          .Property(td => td.AutoGen)
          .HasColumnType("BOOLEAN")
          .IsRequired();
    }
}
