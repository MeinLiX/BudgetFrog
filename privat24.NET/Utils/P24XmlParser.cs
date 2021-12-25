using System.Xml;
using System.Xml.Serialization;


namespace privat24.NET.Utils;

public class P24XmlParser
{
    public static string ParseToString(object toParse, bool rootElement = true)
    {
        if (toParse is null)
        {
            throw new NullReferenceException();
        }

        string xmlString = "";
        XmlSerializer serializer = new(toParse.GetType());
        using (StringWriter sww = new())
        {
            using XmlWriter writer = XmlWriter.Create(sww, new XmlWriterSettings { Indent = false, OmitXmlDeclaration = !rootElement });
            serializer.Serialize(writer, toParse);

            xmlString = sww.ToString();

            if (rootElement is false)
            {
                xmlString = xmlString[(xmlString.IndexOf('>') + 1)..xmlString.LastIndexOf('<')];
            }
        }
        return xmlString;
    }

    //todo catch invalid signature
    public static T ParseToObject<T>(string xmlString) where T : class
    {
        XmlSerializer serializer = new(typeof(T), new XmlRootAttribute("response"));
        using TextReader reader = new StringReader(xmlString);
        return serializer.Deserialize(reader) as T ?? throw new NullReferenceException();
    }
}
