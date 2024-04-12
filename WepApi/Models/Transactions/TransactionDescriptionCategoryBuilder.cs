using WepApi.Models.Common;

namespace WepApi.Models.Transactions;

public static class TransactionDescriptionCategoryBuilder
{
    public static void BuildTransactionDescriptionCategory(this ModelBuilder MB)
    {
        MB.BuildModelBase<TransactionDescriptionCategory>();

        MB.Entity<TransactionDescriptionCategory>()
          .Property(td => td.Name)
          .HasColumnType("VARCHAR(32)")
          .IsRequired();

        MB.Entity<TransactionDescriptionCategory>()
          .Property(td => td.Income)
          .HasColumnType("BOOLEAN")
          .IsRequired();

        MB.Entity<TransactionDescriptionCategory>()
          .Property(td => td.Color)
          .HasColumnType("VARCHAR(13)") //(000,000,000)
          .IsRequired();

        
        
        MB.Entity<TransactionDescriptionCategory>()
            .Ignore(p => p.ExternalName); //External category name for bank category mapping. Excluded DB
    }
}
