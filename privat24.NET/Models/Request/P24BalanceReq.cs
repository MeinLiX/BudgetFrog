using privat24.NET.Models.Common;
using System.Xml.Serialization;

namespace privat24.NET.Models.Request;

public class P24BalanceReq : P24BasicRequest
{
    [XmlElement("data")]
    public P24BalanceDataReq Data { get; set; }
}
