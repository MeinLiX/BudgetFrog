using System.Xml.Serialization;

namespace privat24.NET.Models.Common;

public class P24InfoCardBalance
{
    [XmlElement("cardbalance")]
    public P24CardBalance CardBalance { get; set; }
}
