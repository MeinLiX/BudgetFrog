using WepApi.Models.Budgets;
using WepApi.Models.Common;

namespace WepApi.Models.Transactions;

public class TransactionDescription : ModelBase
{
    public DateTime Date { get; set; }

    public string Notes { get; set; }

    public string RecepitUrl { get; set; }

    public Balance Balance { get; set; }

    public TransactionDescriptionCategory TransactionDescriptionCategory { get; set; }

    public Budget Budget { get; set; }
}
