using WepApi.Models.Common;

namespace WepApi.Models.Auth;

public static class AppIdentityUserBuilder
{
    public static void BuildAppIdentityUser(this ModelBuilder MB)
    {
        MB.BuildModelBase<AppIdentityUser>();

        MB.Entity<AppIdentityUser>()
          .Property(u => u.Email)
          .HasColumnType("VARCHAR(32)")
          .IsRequired();

        MB.Entity<AppIdentityUser>()
          .Property(u => u.FirstName)
          .HasColumnType("VARCHAR(16)")
          .IsRequired();

        MB.Entity<AppIdentityUser>()
          .Property(u => u.LastName)
          .HasColumnType("VARCHAR(16)")
          .IsRequired();

        MB.Entity<AppIdentityUser>()
          .Property(u => u.Password)
          .HasColumnType("VARCHAR(64)")
          .IsRequired();

        MB.Entity<AppIdentityUser>()
          .Property(u => u.PhotoUrl)
          .HasColumnType("TEXT")
          .HasDefaultValue("todo");
    }
}
