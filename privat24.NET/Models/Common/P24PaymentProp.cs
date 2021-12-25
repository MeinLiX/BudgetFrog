using System.Xml.Serialization;

namespace privat24.NET.Models.Common;

public class p24PaymentProp
{
    [XmlAttribute("name")]
    public string Name { get; set; }

    [XmlAttribute("value")]
    public string Value { get; set; }
}
