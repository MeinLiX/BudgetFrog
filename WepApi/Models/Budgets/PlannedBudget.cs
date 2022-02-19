using WepApi.Models.Common;
using WepApi.Models.Transactions;

namespace WepApi.Models.Budgets;

public class PlannedBudget : ModelBase
{
    public DateTime DateStart { get; set; }

    public DateTime DateEnd { get; set; }

    public string Title { get; set; }

    public string Desctiption { get; set; }

    public Balance PlannedBalance { get; set; }

    public TransactionDescriptionCategory TransactionDescriptionCategory { get; set; }

    public Budget Budget { get; set; }
}
