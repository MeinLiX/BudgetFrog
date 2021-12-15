using WepApi.Models.Common;

namespace WepApi.Models.Budgets;

public class TransactionDescriptionCategory : ModelBase
{
    public string Name { get; set; }

    public bool Income { get; set; }

    public string Color { get; set; }
}
