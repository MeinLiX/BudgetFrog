using System.Xml.Serialization;

namespace privat24.NET.Models.Common;

public class P24Card
{
    [XmlElement("account")]
    public string Account { get; set; }

    [XmlElement("card_number")]
    public string CardNumber { get; set; }

    [XmlElement("acc_name")]
    public string AccName { get; set; }

    [XmlElement("acc_type")]
    public string AccType { get; set; }

    [XmlElement("currency")]
    public string Currency { get; set; }

    [XmlElement("card_type")]
    public string CardType { get; set; }

    [XmlElement("main_card_number")]
    public string MainCardNumber { get; set; }

    [XmlElement("card_stat")]
    public string CardStat { get; set; }

    [XmlElement("src")]
    public string Src { get; set; }
}
