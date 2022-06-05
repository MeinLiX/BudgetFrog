using privat24.NET.Models.Common;
using System.Xml.Serialization;

namespace privat24.NET.Models.Request;

public class P24InformationDataReq : P24Data
{
    [XmlElement("wait")]
    public string Wait { get; set; } = "0";

    [XmlElement("test")]
    public string Test { get; set; } = "0";

    [XmlElement("payment")]
    public P24Payment Payment { get; set; } = new();
}
