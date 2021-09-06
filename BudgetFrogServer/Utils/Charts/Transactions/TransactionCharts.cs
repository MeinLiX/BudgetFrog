using BudgetFrogServer.Models;
using BudgetFrogServer.Models.Basis;

namespace BudgetFrogServer.Utils.Charts.Transactions
{
    public class TransactionCharts
    {
        private readonly DB_Context _base_context;
        private readonly DB_ExchangeRatesContext _ER_context;

        public TransactionCharts(DB_Context base_context, DB_ExchangeRatesContext ER_context)
        {
            _base_context = base_context;
            _ER_context = ER_context;
        }

        public Chart BuildChart(int graphNumber,int userID, int lastDays) => graphNumber switch
        {
            1 => new Graph1(_base_context, _ER_context,userID, lastDays).BuildChart(),
            _ => new Chart()
        };
    }
}
