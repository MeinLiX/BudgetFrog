using privat24.NET.Models.Common;
using privat24.NET.Models.Request;
using privat24.NET.Models.Response;
using privat24.NET.Utils;

namespace privat24.NET.Source;

public class P24Client
{
    private static Uri GetUrl(string endPoint) => new($"https://api.privatbank.ua/p24api/{endPoint}");
    public static string XmlMediaType { get; } = "application/xml";
    private static HttpClient Client { get; } = new();

    public static async Task<P24BalanceRes> Balance(string id, string password, string card)
    {
        P24BalanceDataReq p24BalanceDataRequest = new();
        p24BalanceDataRequest.Payment.p24PaymentProps.AddRange(
            new List<p24PaymentProp>(){
                    new p24PaymentProp(){ Name = "cardnum", Value = card},
                    new p24PaymentProp(){ Name = "country", Value = "UA"}
            });

        P24BalanceReq p24BalanceRequest = new()
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

    private static bool SignatureValid<T>(T xmlResponse, string password) where T : class
    {
        bool result = false;

        //EXOTIC SWITCH(xmlResponse.GetType()) :)
        new Dictionary<Type, Action>{
           {typeof(P24BalanceRes), () => {
               P24BalanceRes xmlResponseObject = (xmlResponse as P24BalanceRes) ?? throw new NullReferenceException();
               string RealSignature = HashEngine.SHA1MD5(P24XmlParser.ParseToString(xmlResponseObject.Data, false), password);
               result = RealSignature == xmlResponseObject.Merchant.Signature;
               }
            }
            // and another response types...
        }[xmlResponse.GetType()]();

        return result;
    }
}
