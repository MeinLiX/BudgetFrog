using WepApi.Models.Common;

namespace WepApi.Models.Budgets;

public static class PlannedBudgetBuilder
{
    public static void BuildPlannedBudget(this ModelBuilder MB)
    {
        MB.BuildModelBase<PlannedBudget>();

        MB.Entity<PlannedBudget>()
          .Property(pb => pb.DateStart)
          .HasColumnType("DATE")
          .IsRequired();
        
        MB.Entity<PlannedBudget>()
          .Property(pb => pb.DateEnd)
          .HasColumnType("DATE")
          .IsRequired();

        MB.Entity<PlannedBudget>()
          .Property(pb => pb.Title)
          .HasColumnType("VARCHAR(32)");
    
        MB.Entity<PlannedBudget>()
          .Property(pb => pb.Desctiption)
          .HasColumnType("TEXT");
    }
}
