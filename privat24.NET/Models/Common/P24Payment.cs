using System.Xml.Serialization;

namespace privat24.NET.Models.Common;

public class P24Payment
{
    [XmlAttribute("id")]
    public string Id { get; set; } = "";

    [XmlElement("prop")]
    public List<P24PaymentProp> PaymentProps { get; set; } = new();
}
