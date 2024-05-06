using System.Text.Json;
using WepApi.Models.Externals.MonobankApi;

namespace WepApi.Utils;

public static class Constants
{
    public const string Currencies = "AED|AFN|ALL|AMD|ANG|AOA|ARS|AUD|AWG|AZN|BAM|BBD|BDT|BGN|BHD|BIF|BMD|BND|BOB|BRL|BSD|BTN|BWP|BZD|CAD|CDF|CHF|CLF|CLP|CNH|CNY|COP|CUP|CVE|CZK|DJF|DKK|DOP|DZD|EGP|ERN|ETB|EUR|FJD|FKP|GBP|GEL|GHS|GIP|GMD|GNF|GTQ|GYD|HKD|HNL|HRK|HTG|HUF|IDR|ILS|INR|IQD|IRR|ISK|JMD|JOD|JPY|KES|KGS|KHR|KMF|KPW|KRW|KWD|KYD|KZT|LAK|LBP|LKR|LRD|LSL|LYD|MAD|MDL|MGA|MKD|MMK|MNT|MOP|MRU|MUR|MVR|MWK|MXN|MYR|MZN|NAD|NGN|NOK|NPR|NZD|OMR|PAB|PEN|PGK|PHP|PKR|PLN|PYG|QAR|RON|RSD|RUB|RWF|SAR|SCR|SDG|SEK|SGD|SHP|SLL|SOS|SRD|SYP|SZL|THB|TJS|TMT|TND|TOP|TRY|TTD|TWD|TZS|UAH|UGX|USD|UYU|UZS|VND|VUV|WST|XAF|XCD|XDR|XOF|XPF|YER|ZAR|ZMW";
    
    public static int AvaliableYear => DateTime.Now.Year + 10;

    private static List<MCC> mcc_en;
    public static string GetDescriptionMCC_EN(string code, bool full= false)
    {
        if(mcc_en == null || mcc_en.Count == 0)
        {
            mcc_en = JsonSerializer.Deserialize<List<MCC>>(File.ReadAllText("mcc_en")) ?? null;
        }
        if (mcc_en == null) return string.Empty;
        var res = mcc_en.FirstOrDefault(mcc => mcc.mcc == code);
        if (res == null) return string.Empty;

        return full ? res.fullDescription : res.shortDescription;
    }
   

}

public class MCC
{
    public string mcc { get; set; }
    public string shortDescription { get; set; }
    public string fullDescription { get; set; }
}
