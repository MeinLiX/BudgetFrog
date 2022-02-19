using WepApi.Models.Common;

namespace WepApi.Models.Budgets;

public static class BudgetBuilder
{
    public static void BuildBudget(this ModelBuilder MB)
    {
        MB.BuildModelBase<Budget>();

        MB.Entity<Budget>()
          .Property(pb => pb.Name)
          .HasColumnType("VARCHAR(32)");

        MB.Entity<Budget>()
         .Property(m => m.InviteToken)
         .HasColumnType("VARCHAR(32)");
    }
}
