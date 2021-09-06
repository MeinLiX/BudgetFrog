using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BudgetFrogServer.Models;
using BudgetFrogServer.Models.Basis;
using BudgetFrogServer.Utils.Charts.interfaces;


namespace BudgetFrogServer.Utils.Charts.TransactionCategories
{
    public class Graph1 : IChartBuildComponents
    {
        private readonly DB_Context _base_context;

        public readonly int userID;

        private List<Transaction> _transactions;
        private List<TransactionCategory> _transactionCategories;

        public Chart LocalChart { get; set; }

        public Graph1(DB_Context base_context, int userID)
        {
            _base_context = base_context;
            this.userID = userID;
        }

        /// <summary>
        /// Used transaction categories.
        /// </summary>
        /// <returns>Chart type is PolarArea</returns>
        public Chart BuildChart()
        {
            LocalChart = new();
            Task.WaitAll(new[] {
                InitialData()
            });

            LocalChart.labels.AddRange(GetLabels());

            LocalChart.datasets.Add(new Chart.DataSet(
                    type: null,
                    label: "# of transaction categories",
                    backgroundColor: GetBackgroundColors(),
                    borderWidth: 2,
                    fill: true,
                    data: GetDataSetBarData()
            ));

            return LocalChart;
        }

        public async Task InitialData()
        {
            await Task.Run(() =>
            {
                _transactions = _base_context.Transaction
                                     .Where(t => t.AppIdentityUser.ID == userID)
                                     .ToList();

                _transactionCategories = _base_context.TransactionCategory
                                          .Where(tc => tc.AppIdentityUser.ID == userID)
                                          .ToList();
            });
        }

        private List<float> GetDataSetBarData() => _transactionCategories
                                                     .Select(tc => (float)_transactions.Where(t => t.TransactionCategoryID == tc.ID).Count())
                                                     .ToList();

        private List<string> GetLabels() => _transactionCategories
                                                     .Select(tc => tc.Name)
                                                     .ToList();

        private List<string> GetBackgroundColors()=> _transactionCategories
                                                     .Select(tc => tc.Color)
                                                     .ToList();
    }
}
