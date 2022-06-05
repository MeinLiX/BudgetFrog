using System.Xml.Serialization;

namespace privat24.NET.Models.Common;

[XmlRoot("request")]
public class P24BasicRequest
{
    [XmlAttribute("version")]
    public string Version { get; set; } = "1.0";

    [XmlElement("merchant")]
    public P24Merchant Merchant { get; set; }

    //[XmlElement("data")]
    //public P24Data Data { get; set; }
}
