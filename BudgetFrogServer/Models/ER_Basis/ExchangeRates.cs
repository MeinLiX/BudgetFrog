using BudgetFrogServer.Models.Common;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace BudgetFrogServer.Models.ER_Basis
{
    public class ExchangeRates : ModelBase
    {
        public string @base { get; set; }
        public Results results { get; set; }
        public string updated { get; set; }
        public int ms { get; set; }

        public Dictionary<string, float> GetCourses() =>
            results.GetType()
                   .GetProperties(BindingFlags.Instance | BindingFlags.Public)
                   .ToDictionary(prop => prop.Name, prop => float.Parse(prop.GetValue(results, null).ToString()));

        public float GetRate(string from, string to)
        {
            var dict = GetCourses();

            if (from == to)
                return 1;

            if (from == @base && to != @base)
                return dict[to];

            if (from != @base && to == @base)
                return 1 / dict[from];

            return dict[from] / dict[to];
        }

        public float Exchange(float amount, float rate) => amount * rate;

        public float Convert(string from, string to, float amount) => Exchange(amount, GetRate(from, to));
    }
}
