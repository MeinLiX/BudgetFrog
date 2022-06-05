using System.Xml.Serialization;

namespace privat24.NET.Models.Common;

public class P24Merchant
{
    [XmlElement("id")]
    public string Id { get; set; }

    [XmlElement("signature")]
    public string Signature { get; set; }
}
