using privat24.NET.Models.Common;
using System.Xml.Serialization;

namespace privat24.NET.Models.Response;

public class P24BalanceDataRes : P24Data
{
    [XmlElement("info")]
    public P24InfoCardBalance Info { get; set; }
}
