namespace WepApi.Models.Common;

public static class ModelBaseBuilder
{
    public static void BuildModelBase<T>(this ModelBuilder MB) where T : ModelBase
    {
        MB.Entity<T>()
          .HasKey(m => m.ID);

        MB.Entity<T>()
          .Property(m => m.ID)
          .HasColumnType("VARCHAR(36)");
    }
}
