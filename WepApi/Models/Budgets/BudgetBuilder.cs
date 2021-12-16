using WepApi.Models.Common;

namespace WepApi.Models.Budgets;

public static class BudgetBuilder
{
    public static void BuildBudget(this ModelBuilder MB)
    {
        MB.BuildModelBase<Budget>();
    }
}
