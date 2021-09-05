using System.Collections.Generic;

namespace BudgetFrogServer.Models.Basis
{
    public class TransactionGraph
    {
        public class Bar
        {
            public List<string> labels { get; set; } = new();
            public List<DataSet> datasets { get; set; } = new();
        }

        public class DataSet
        {
            public string type { get; set; }
            public string label { get; set; }
            public string backgroundColor { get; set; }
            public int borderWidth { get; set; }
            public bool fill { get; set; }
            public List<int> data { get; set; }

            public DataSet()
            {

            }

            public DataSet(string type, string label, string backgroundColor, int borderWidth, bool fill, List<int> data = null)
            {
                this.type = type;
                this.label = label;
                this.backgroundColor = backgroundColor;
                this.borderWidth = borderWidth;
                this.fill = fill;
                this.data = data ?? new();
            }
        }
    }

}
