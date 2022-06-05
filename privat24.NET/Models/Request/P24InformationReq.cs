using privat24.NET.Models.Common;
using System.Xml.Serialization;

namespace privat24.NET.Models.Request;

public class P24InformationReq : P24BasicRequest
{
    [XmlElement("data")]
    public P24InformationDataReq Data { get; set; }
}
