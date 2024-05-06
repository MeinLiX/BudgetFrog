using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using WepApi.Models.Budgets;
using WepApi.Models.Common;
using WepApi.Utils;

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

    public string GetSummary(int v = 1)
    {
        if (v == 0)
        {
        var tempModel = new
            {
                Amount = $"{(TransactionDescriptionCategory.Income ? "-" : "+")}{Balance.Amount}",
                Category = TransactionDescriptionCategory.MMC > 0 ? Constants.GetDescriptionMCC_EN(TransactionDescriptionCategory.MMC.ToString()) : TransactionDescriptionCategory.Name,
                Date = Date.ToString(),
                Currency = "UAH",
            };
            return JsonSerializer.Serialize(tempModel, options: new()
            {
                WriteIndented = false,
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            });
        }
        else
        {
            return string.Format("{0},{1},{2},{3}", 
                $"{(TransactionDescriptionCategory.Income ? "-" : "+")}{Balance.Amount}",
                TransactionDescriptionCategory.MMC > 0 ? Constants.GetDescriptionMCC_EN(TransactionDescriptionCategory.MMC.ToString()) : TransactionDescriptionCategory.Name,
                Date.ToString(), 
                "UAH");
        }
    }
}
