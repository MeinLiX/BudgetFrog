namespace WepApi.Models.Externals.MonobankApi;

public class StatementResponse
{
    public string id { get; set; }
    public int time { get; set; }
    public string description { get; set; }
    public int mcc { get; set; }
    public int originalMcc { get; set; }
    public bool hold { get; set; }
    public int amount { get; set; }
    public int operationAmount { get; set; }
    public int currencyCode { get; set; }
    public int commissionRate { get; set; }
    public int cashbackAmount { get; set; }
    public int balance { get; set; }
    public string comment { get; set; }
    public string receiptId { get; set; }
    public string invoiceId { get; set; }
    public string counterEdrpou { get; set; }
    public string counterIban { get; set; }
    public string counterName { get; set; }
}
