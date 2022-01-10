using privat24.NET.Models.Common;
using System.Xml.Serialization;

namespace privat24.NET.Models.Response;

public class P24StatementsDataRes : P24Data
{
    [XmlElement("info")]
    public P24InfoStatements Info { get; set; }
}
