using System.Text.Json.Serialization;
using WepApi.Models.Common;

namespace WepApi.Models.Privat24;

public class Privat24Credential : ModelBase
{
    public string MerchantID { get; set; }

    [JsonIgnore]
    public string MerchantPassword { get; set; }

    public string CardNumber { get; set; }

    public DateTime StartDate { get; set; }
}
