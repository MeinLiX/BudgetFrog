using WepApi.Models.Common;

namespace WepApi.Models.Privat24;

public class Privat24Credential : ModelBase
{
    public string MerchantID { get; set; }

    public string MerchantPassword { get; set; }

    public string CardNumber { get; set; }
}
