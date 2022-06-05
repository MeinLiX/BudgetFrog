using System.Xml.Serialization;

namespace privat24.NET.Models.Common;

public class P24CardBalance
{
    [XmlElement("card")]
    public P24Card Card { get; set; }

    [XmlElement("av_balance")]
    public string AvBalance { get; set; }

    [XmlElement("bal_date")]
    public string BalDate { get; set; }

    [XmlElement("bal_dyn")]
    public string BalDyn { get; set; }

    [XmlElement("balance")]
    public string Balance { get; set; }

    [XmlElement("fin_limit")]
    public string FinLimit { get; set; }

    [XmlElement("trade_limit")]
    public string TradeLimit { get; set; }
}
