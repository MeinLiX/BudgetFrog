using privat24.NET.Models.Response;
using System.Xml;
using System.Xml.Serialization;


namespace privat24.NET.Utils;

public class P24XmlParser
{

    public static string ParseToString(object toParse, bool rootElement = true, bool selfTag = false)
    {
        if (toParse is null)
        {
            throw new NullReferenceException();
        }

        string xmlString = "";
        XmlSerializer serializer = new(toParse.GetType());
        using (StringWriter sww = new())
        {
            using XmlWriterEE writer = new(XmlWriter.Create(sww, new XmlWriterSettings { Indent = false, OmitXmlDeclaration = !rootElement }), selfTag);
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

    public class XmlWriterEE : XmlWriter
    {
#pragma warning disable CS8765 // Nullability of type of parameter doesn't match overridden member (possibly because of nullability attributes).
        private XmlWriter baseWriter;
        private bool _selfTag = false;
        public XmlWriterEE(XmlWriter w, bool selfTag = false)
        {
            baseWriter = w;
            _selfTag = selfTag;
        }
        public override void WriteEndElement()
        {
            if (_selfTag)
            {
                baseWriter.WriteEndElement();
            }
            else
            {
                baseWriter.WriteFullEndElement();
            };
        }

        public override void WriteFullEndElement() => baseWriter.WriteFullEndElement();
        public override void Close() => baseWriter.Close();
        public override void Flush() => baseWriter.Flush();
        public override string? LookupPrefix(string ns) => (baseWriter.LookupPrefix(ns));
        public override void WriteBase64(byte[] buffer, int index, int count) => baseWriter.WriteBase64(buffer, index, count);
        public override void WriteCData(string text) => baseWriter.WriteCData(text);
        public override void WriteCharEntity(char ch) => baseWriter.WriteCharEntity(ch);
        public override void WriteChars(char[] buffer, int index, int count) => baseWriter.WriteChars(buffer, index, count);
        public override void WriteComment(string text) => baseWriter.WriteComment(text);
        public override void WriteDocType(string name, string pubid, string sysid, string subset) => baseWriter.WriteDocType(name, pubid, sysid, subset);
        public override void WriteEndAttribute() => baseWriter.WriteEndAttribute();
        public override void WriteEndDocument() => baseWriter.WriteEndDocument();
        public override void WriteEntityRef(string name) => baseWriter.WriteEntityRef(name);
        public override void WriteProcessingInstruction(string name, string text) => baseWriter.WriteProcessingInstruction(name, text);
        public override void WriteRaw(string data) => baseWriter.WriteRaw(data);
        public override void WriteRaw(char[] buffer, int index, int count) => baseWriter.WriteRaw(buffer, index, count);
        public override void WriteStartAttribute(string prefix, string localName, string ns) => baseWriter.WriteStartAttribute(prefix, localName, ns);
        public override void WriteStartDocument(bool standalone) => baseWriter.WriteStartDocument(standalone);
        public override void WriteStartDocument() => baseWriter.WriteStartDocument();
        public override void WriteStartElement(string prefix, string localName, string ns) => baseWriter.WriteStartElement(prefix, localName, ns);
        public override WriteState WriteState => baseWriter.WriteState;
        public override void WriteString(string text) => baseWriter.WriteString(text);
        public override void WriteSurrogateCharEntity(char lowChar, char highChar) => baseWriter.WriteSurrogateCharEntity(lowChar, highChar);
        public override void WriteWhitespace(string ws) => baseWriter.WriteWhitespace(ws);
#pragma warning restore CS8765 // Nullability of type of parameter doesn't match overridden member (possibly because of nullability attributes).
    }
}
