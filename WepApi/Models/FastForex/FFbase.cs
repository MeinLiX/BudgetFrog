using WepApi.Models.Common;

namespace WepApi.Models.FastForex;

public class FFbase : ModelBase
{
    public string @base { get; set; }
    public FFresult results { get; set; }
    public string updated { get; set; }
    public DateTime date { get => DateTime.Parse(updated); }
    public int ms { get; set; }

    public decimal GetRate(string from, string to)
    {
        if (from == to)
            return 1;

        if (from == @base && to != @base)
            return results[to];

        if (from != @base && to == @base)
            return 1 / results[from];

        return results[to] / results[from];
    }

    public decimal Exchange(decimal amount, decimal rate) => amount * rate;

    public decimal Convert(string from, string to, decimal amount) => Exchange(amount, GetRate(from, to));
}
