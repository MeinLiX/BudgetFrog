using System.Text.Json.Serialization;
using WepApi.Models.Common;

namespace WepApi.Models.Bank;

public class BankCredential : ModelBase
{
    public string MerchantID { get; set; }

    [JsonIgnore]
    public string MerchantPassword { get; set; }

    public string CardNumber { get; set; }

    public BankTypes BankType { get; set; }
}

public enum BankTypes : int
{
    PribatBank = 0,
    MonoBank = 1,
}
