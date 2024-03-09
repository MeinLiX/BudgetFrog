using privat24.NET.Models.Common;
using privat24.NET.Models.Request;
using privat24.NET.Models.Response;
using privat24.NET.Utils;

namespace privat24.NET.Source;

[Obsolete]
public class P24Client
{
    private static Uri GetUrl(string endPoint) => new($"https://api.privatbank.ua/p24api/{endPoint}");
    public static string XmlMediaType { get; } = "application/xml";
    private static HttpClient Client { get; } = new();

    //Method for check credentials
    public static async Task<P24BalanceRes> Balance(string id, string password, string card)
    {
        P24InformationDataReq p24BalanceDataRequest = new();
        p24BalanceDataRequest.Payment.PaymentProps.AddRange(
            new List<P24PaymentProp>(){
                    new P24PaymentProp(){ Name = "cardnum", Value = card},
                    new P24PaymentProp(){ Name = "country", Value = "UA"}
            });

        P24InformationReq p24BalanceRequest = new()
        {
            Merchant = new P24Merchant()
            {
                Id = id,
                Signature = HashEngine.SHA1MD5(P24XmlParser.ParseToString(p24BalanceDataRequest, false), password)
            },
            Data = p24BalanceDataRequest
        };
        string xmlRequestContent = P24XmlParser.ParseToString(p24BalanceRequest);

        HttpRequestMessage httpRequest = new()
        {
            Method = HttpMethod.Post,
            RequestUri = GetUrl("balance"),
            Content = new StringContent(xmlRequestContent, System.Text.Encoding.UTF8, XmlMediaType)
        };

        HttpResponseMessage response = await Client.SendAsync(httpRequest);
        string responseContext = await response.Content.ReadAsStringAsync();
        var xmlObject = P24XmlParser.ParseToObject<P24BalanceRes>(responseContext[(responseContext.IndexOf('>') + 1)..]);

        if (SignatureValid(xmlObject, password) is false)
        {
            throw new Exception("Response signature incorrect, try again.");
        }

        return xmlObject;
    }

    public static async Task<P24StatementsRes> Statement(DateTime startDate, DateTime endDate, string id, string password, string card)
    {
        P24InformationDataReq p24InformationDataRequest = new();
        p24InformationDataRequest.Payment.PaymentProps.AddRange(
            new List<P24PaymentProp>(){
                    new P24PaymentProp(){ Name = "sd", Value = $"{startDate:dd.MM.yyyy}"},
                    new P24PaymentProp(){ Name = "ed", Value = $"{endDate:dd.MM.yyyy}"},
                    new P24PaymentProp(){ Name = "card", Value = card},

            });

        P24InformationReq p24BalanceRequest = new()
        {
            Merchant = new P24Merchant()
            {
                Id = id,
                Signature = HashEngine.SHA1MD5(P24XmlParser.ParseToString(p24InformationDataRequest, false), password)
            },
            Data = p24InformationDataRequest
        };
        string xmlRequestContent = P24XmlParser.ParseToString(p24BalanceRequest);

        HttpRequestMessage httpRequest = new()
        {
            Method = HttpMethod.Post,
            RequestUri = GetUrl("rest_fiz"),
            Content = new StringContent(xmlRequestContent, System.Text.Encoding.UTF8, XmlMediaType)
        };

        HttpResponseMessage response = await Client.SendAsync(httpRequest);
        string responseContext = await response.Content.ReadAsStringAsync();
        var xmlObject = P24XmlParser.ParseToObject<P24StatementsRes>(responseContext[(responseContext.IndexOf('>') + 1)..]);

        //TODO: signature response validation
        //if (SignatureValid(xmlObject, password) is false)
        //{
        //    throw new Exception("Response signature incorrect, try again.");
        //}

        return xmlObject;
    }

    private static bool SignatureValid<T>(T xmlResponse, string password) where T : P24BasicResponse
    {
        bool result = false;

        //EXOTIC SWITCH(xmlResponse.GetType()) :)
        new Dictionary<Type, Action>{
           {typeof(P24BalanceRes), () => {
               P24BalanceRes xmlResponseObject = (xmlResponse as P24BalanceRes) ?? throw new NullReferenceException();
               string RealSignature = HashEngine.SHA1MD5(P24XmlParser.ParseToString(xmlResponseObject.Data, false), password);
               result = RealSignature == xmlResponseObject.Merchant.Signature;
               }
            },
            {typeof(P24StatementsRes), () => {
               P24StatementsRes xmlResponseObject = (xmlResponse as P24StatementsRes) ?? throw new NullReferenceException();
               string RealSignature = HashEngine.SHA1MD5(P24XmlParser.ParseToString(xmlResponseObject.Data, false, true), password);
               result = RealSignature == xmlResponseObject.Merchant.Signature;
               }
            }
        }[xmlResponse.GetType()]();

        return result;
    }
}
