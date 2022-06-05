using privat24.NET.Models.Common;
using System.Xml.Serialization;

namespace privat24.NET.Models.Response;

[XmlRoot("response")]
public class P24StatementsRes : P24BasicResponse
{
    [XmlElement("data")]
    public P24StatementsDataRes Data { get; set; }
}
