using System.Xml.Serialization;

namespace privat24.NET.Models.Common;

public class P24Data
{
    [XmlElement("oper")]
    public string Oper { get; set; } = "cmt";
}
