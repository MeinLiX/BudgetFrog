using WepApi.Models.Common;

namespace WepApi.Models.Budgets;

public class Balance : ModelBase
{
    public decimal Amount { get; set; }

    public string Currency { get; set; }
}
