using BudgetFrogServer.Models;
using BudgetFrogServer.Models.Basis;

namespace BudgetFrogServer.Utils.Charts.TransactionCategories
{
    public class TransactionCategoryCharts
    {
        private readonly DB_Context _base_context;
        private readonly DB_ExchangeRatesContext _ER_context;

        public TransactionCategoryCharts(DB_Context base_context, DB_ExchangeRatesContext ER_context)
        {
            _base_context = base_context;
            _ER_context = ER_context;
        }

        public TransactionCategoryCharts(DB_Context base_context) : this(base_context, null) { }

        //TODO C:
        public Chart BuildChart(int graphNumber, int userID, int lastDays) => graphNumber switch
        {
            1 => new Graph1(_base_context, userID).BuildChart(),
            _ => new Chart()
        };
    }
}
