using WepApi.Models.Common;

namespace WepApi.Models.Privat24;

public static class Privat24CredentialBuilder
{
    public static void BuildPrivat24Credential(this ModelBuilder MB)
    {
        MB.BuildModelBase<Privat24Credential>();

        MB.Entity<Privat24Credential>()
          .Property(td => td.MerchantID)
          .HasColumnType("VARCHAR(16)")
          .IsRequired();

        MB.Entity<Privat24Credential>()
          .Property(td => td.MerchantPassword)
          .HasColumnType("VARCHAR(32)")
          .IsRequired();

        MB.Entity<Privat24Credential>()
          .Property(td => td.CardNumber)
          .HasColumnType("VARCHAR(16)")
          .IsRequired();

        MB.Entity<Privat24Credential>()
          .Property(pb => pb.StartDate)
          .HasColumnType("DATE")
          .IsRequired();
    }

}
