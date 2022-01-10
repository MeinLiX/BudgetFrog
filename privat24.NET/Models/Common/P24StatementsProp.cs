using System.Xml.Serialization;

namespace privat24.NET.Models.Common;

public class P24StatementsProp
{
    [XmlAttribute("card")]
    public string Card { get; set; }

    [XmlAttribute("appcode")]
    public string Appcode { get; set; }

    [XmlAttribute("trandate")]
    public string Trandate { get; set; }

    [XmlAttribute("trantime")]
    public string Trantime { get; set; }

    [XmlAttribute("amount")]
    public string Amount { get; set; }

    [XmlAttribute("cardamount")]
    public string Cardamount { get; set; }

    [XmlAttribute("rest")]
    public string Rest { get; set; }

    [XmlAttribute("terminal")]
    public string Terminal { get; set; }

    [XmlAttribute("description")]
    public string Description { get; set; }
}
