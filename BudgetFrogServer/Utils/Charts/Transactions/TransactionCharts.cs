using BudgetFrogServer.Models.Basis;
using System.Collections.Generic;

namespace BudgetFrogServer.Utils.Charts.Transactions
{
    public class TransactionCharts
    {
        private readonly List<Transaction> _transactions;
        private readonly List<TransactionCategory> _transactionCategories;

        public TransactionCharts(List<Transaction> transactions, List<TransactionCategory> transactionCategories)
        {
            _transactions = transactions;
            _transactionCategories = transactionCategories;
        }

        public Chart BuildChart(int graphNumber, int lastDays = 7) => graphNumber switch
        {
            1 => new Graph1(_transactions, _transactionCategories, lastDays).BuildChart(),
            _ => new Chart()
        };
    }
}
