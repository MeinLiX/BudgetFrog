using System.Xml.Serialization;

namespace privat24.NET.Models.Common;

public class P24Statements
{
    [XmlAttribute("status")]
    public string Status { get; set; } = "";    
    
    [XmlAttribute("credit")]
    public string Credit { get; set; } = "";    
    
    [XmlAttribute("debet")]
    public string Debet { get; set; } = "";



    [XmlElement("statement")]
    public List<P24StatementsProp> StatementsProp { get; set; } = new();
}
