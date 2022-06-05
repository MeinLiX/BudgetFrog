using System.Xml.Serialization;

namespace privat24.NET.Models.Common;

public class P24InfoStatements
{
    [XmlElement("statements")]
    public P24Statements Statements { get; set; }
}
