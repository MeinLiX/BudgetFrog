using System.Text.Json.Serialization;
using WepApi.Models.Budgets;
using WepApi.Models.Common;

namespace WepApi.Models.Transactions;

public class TransactionDescription : ModelBase
{
    public DateTime Date { get; set; }

    public string Notes { get; set; }

    public bool AutoGen { get; set; }

    public Balance Balance { get; set; }

    public TransactionDescriptionCategory TransactionDescriptionCategory { get; set; }

    [JsonIgnore]
    public Budget Budget { get; set; }
}
