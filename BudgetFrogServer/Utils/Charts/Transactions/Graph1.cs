using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BudgetFrogServer.Models;
using BudgetFrogServer.Models.Auth;
using BudgetFrogServer.Models.Basis;
using BudgetFrogServer.Models.ER_Basis;
using BudgetFrogServer.Utils.Charts.interfaces;
using Microsoft.EntityFrameworkCore;

namespace BudgetFrogServer.Utils.Charts.Transactions
{
    class Graph1 : IChartBuildComponents
    {
        private readonly DB_Context _base_context;
        private readonly DB_ExchangeRatesContext _ER_context;

        public readonly int userID;
        public readonly int lastDays;

        private List<Transaction> _transactions;
        private List<TransactionCategory> _transactionCategories;
        private AppIdentityUser _user;
        private ExchangeRates _exchangeRates;

        public Chart LocalChart { get; set; }

        public Graph1(DB_Context base_context, DB_ExchangeRatesContext ER_context, int userID, int lastDays)
        {
            _base_context = base_context;
            _ER_context = ER_context;
            this.userID = userID;
            this.lastDays = lastDays;
        }

        /// <summary>
        /// Transaction and balance chart by categories for a certain time.
        /// </summary>
        /// <returns>Chart type is Bar</returns>
        public Chart BuildChart()
        {
            LocalChart = new();
            Task.WaitAll(new[] {
                InitialData()
            });

            LocalChart.labels.AddRange(GetLabels());

            _transactionCategories
                .ForEach(tc => LocalChart.datasets.Add(new Chart.DataSet(
                    type: "bar",
                    label: $"{tc.Name } ({_transactions.Where(t => t.TransactionCategoryID == tc.ID).Count()})",
                    backgroundColor: tc.Color,
                    borderWidth: 2,
                    fill: true,
                    data: GetDataSetBarData(tc)
            )));

            LocalChart.datasets.Add(new Chart.DataSet(
                    type: "line",
                    label: "balance",
                    backgroundColor: "rgba(17,140,79,0.1)",
                    borderWidth: 4,
                    fill: true,
                    data: GetDataSetLineData()
            ));
            return LocalChart;
        }

        public async Task InitialData()
        {
            Task<ExchangeRates> exchangeRatesTask = _ER_context.ExchangeRates
                                                                 .Include(er => er.results)
                                                                 .OrderByDescending(er => er.ID)
                                                                 .FirstOrDefaultAsync();
            _transactions = lastDays switch
            {
                <= 0 => _base_context.Transaction
                                     .Include(t => t.TransactionCategory)
                                     .Where(t => t.AppIdentityUser.ID == userID)
                                     .ToList(),
                _ => _base_context.Transaction
                                      .Include(t => t.TransactionCategory)
                                      .Where(transaction =>
                                                transaction.AppIdentityUser.ID == userID &&
                                                (transaction.Date.AddDays(lastDays) >= DateTime.Now)
                                            )
                                      .ToList()
            };

            _transactionCategories = _base_context.TransactionCategory
                                      .Where(tc => tc.AppIdentityUser.ID == userID)
                                      .ToList();

            _user = await _base_context.AppIdentityUser.FirstAsync(u => u.ID == userID); ;
            _exchangeRates = await exchangeRatesTask;
        }

        private List<float> GetDataSetBarData(TransactionCategory transactionCategory) =>
            LocalChart.labels
                      .Select(labelDate =>
                      {
                          float balance = 0;
                          var transactions = _transactions
                                                    .Where(t => t.TransactionCategoryID == transactionCategory.ID
                                                                && t.Date.ToString("MM/dd/yyyy") == labelDate)
                                                    .ToList();
                          //if (transactions.Any())
                          transactions.ForEach(t =>
                          {
                              float toBalance = _exchangeRates.Convert(t.Currency, _user.Currency, (float)t.Balance);
                              balance += (t.TransactionCategory.Income ?? true) ? toBalance : -toBalance;
                          });
                          return balance;
                      }).ToList();

        private List<float> GetDataSetLineData()
        {
            List<float> data = new();
            //(float)_user.Balance
            LocalChart.labels
                      //.Skip(1).ToList()
                      .ForEach(labelDate =>
                        {
                            float lastBalance = data.Any() ? data[^1] : 0;
                            var transactions = _transactions
                                                    .Where(t => t.Date.ToString("MM/dd/yyyy") == labelDate)
                                                    .ToList();
                            transactions.ForEach(t =>
                            {
                                float toBalance = _exchangeRates.Convert(t.Currency, _user.Currency, (float)t.Balance);
                                lastBalance += (t.TransactionCategory.Income ?? true) ? toBalance : -toBalance;
                            });
                            data.Add(lastBalance);
                        });


            return data;
        }

        private List<string> GetLabels() => Enumerable.Range(0, lastDays)
                                                      .Select(i => $"{DateTime.Today.AddDays(-i):MM/dd/yyyy}")
                                                      .ToList();
    }
}
