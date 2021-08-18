using BudgetFrogServer.Models.Common;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.Json.Serialization;

namespace BudgetFrogServer.Models.ER_Basis
{
    public class ExchangeRates : ModelBase
    {
        public string _base { get; set; }
        public Results results { get; set; }
        public string updated { get; set; }
        public int ms { get; set; }

        public Dictionary<string, float> GetCourses() =>
            results.GetType()
                   .GetProperties(BindingFlags.Instance | BindingFlags.Public)
                   .ToDictionary(prop => prop.Name, prop => (float)prop.GetValue(results, null));
    }
}
