using BudgetFrogServer.Models.Basis;
using System.Collections.Generic;

namespace BudgetFrogServer.Utils.Charts.TransactionCategories
{
    public class TransactionCategoryCharts
    {
        private readonly List<TransactionCategory> _transactionCategories;

        public TransactionCategoryCharts(List<TransactionCategory> transactionCategories)
        {
            _transactionCategories = transactionCategories;
        }

        //TODO C:
        public Chart BuildChart(int graphNumber)=> graphNumber switch
            {
                _ => new Chart()
            };
    }
}
