using System.Text.Json.Serialization;
using WepApi.Models.Budgets;
using WepApi.Models.Common;

namespace WepApi.Models.Transactions;

public class TransactionDescriptionCategory : ModelBase
{
    public string Name { get; set; }

    public bool Income { get; set; }

    public string Color { get; set; }

    [JsonIgnore]
    public Budget Budget { get; set; }
}
