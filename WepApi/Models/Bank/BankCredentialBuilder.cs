using WepApi.Models.Common;

namespace WepApi.Models.Bank;

public static class BankCredentialBuilder
{
    public static void BuildBankCredential(this ModelBuilder MB)
    {
        MB.BuildModelBase<BankCredential>();

        MB.Entity<BankCredential>()
          .Property(td => td.MerchantID)
          .HasColumnType("VARCHAR(64)")
          .IsRequired();

        MB.Entity<BankCredential>()
          .Property(td => td.MerchantPassword)
          .HasColumnType("VARCHAR(64)");

        MB.Entity<BankCredential>()
          .Property(td => td.CardNumber)
          .HasColumnType("VARCHAR(64)");

        MB.Entity<BankCredential>()
          .Property(td => td.BankType)
          .HasColumnType("INT");
    }

}
