using BudgetFrogServer.Models.Common;

namespace BudgetFrogServer.Models.ER_Basis
{
    public class CurencyRelationship : ModelBase
    {
        public int FirstCurrencyID { get; set; }
        public Currency FirstCurrency { get; set; }

        public int SecondCurrencyID { get; set; }
        public Currency SecondCurrency { get; set; }

        public double Relation { get; set; } = 0.0;
    }
}
