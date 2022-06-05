using privat24.NET.Models.Common;
using System.Xml.Serialization;

namespace privat24.NET.Models.Response;

[XmlRoot("response")] //required :D
public class P24BalanceRes : P24BasicResponse
{
    [XmlElement("data")]
    public P24BalanceDataRes Data { get; set; }
}
