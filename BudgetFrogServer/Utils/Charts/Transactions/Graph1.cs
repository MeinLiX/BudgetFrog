using System;
using System.Collections.Generic;
using System.Linq;
using BudgetFrogServer.Models.Basis;
using BudgetFrogServer.Utils.Charts.interfaces;

namespace BudgetFrogServer.Utils.Charts.Transactions
{
    class Graph1 : IChartBuildComponents
    {
        private readonly List<Transaction> _transactions;
        private readonly List<TransactionCategory> _transactionCategories;
        public readonly int _lastDays;

        public Chart LocalChart { get; set; }

        public Graph1(List<Transaction> transactions, List<TransactionCategory> transactionCategories, int lastDays)
        {
            _transactions = transactions;
            _transactionCategories = transactionCategories;
            _lastDays = lastDays;
        }

        public Chart BuildChart()
        {
            LocalChart = new();
            LocalChart.labels.AddRange(GetLabels());
            _transactionCategories
                .ForEach(tc => LocalChart.datasets.Add(new Chart.DataSet(
                    type: "bar",
                    label: tc.Name,
                    backgroundColor: tc.Color,
                    borderWidth: 2,
                    fill: true,
                    data: GetDataSetBarData(tc)
            )));

            LocalChart.datasets.Add(new Chart.DataSet(
                    type: "line",
                    label: "User balance",
                    backgroundColor: "rgba(17,140,79,0.1)",
                    borderWidth: 4,
                    fill: true,
                    data: GetDataSetLineData()
            ));
            return LocalChart;
        }

        //TODO:  exchange transaction balance to user currency and fix logic x)
        private List<int> GetDataSetBarData(TransactionCategory transactionCategory)
        {
            List<int> data = new();
            data.AddRange(Enumerable.Range(1, new Random().Next(_lastDays))
                                    .Select(idx =>
                                    {
                                        int balance = decimal.ToInt32(_transactions.Where(t => $"{t:d}" == LocalChart.labels[idx] && t.TransactionCategoryID == transactionCategory.ID).Sum(t => t.Balance) ?? 0);
                                        return (transactionCategory.Income ?? true) ? balance : -balance;
                                    }));
            return data;
        }

        //todo  :)
        private List<int> GetDataSetLineData()
        {
            List<int> data = new();
            data.AddRange(Enumerable.Range(1, new Random().Next(_lastDays - 1))
                                    .Select(i => new Random().Next(-50, 50)));

            int lastBalance = data[^1];
            data.AddRange(Enumerable.Range(0, _lastDays - data.Count)
                                    .Select(i => lastBalance));
            return data;
        }

        private List<string> GetLabels() => Enumerable.Range(1, _lastDays)
                                                      .Select(i => $"{DateTime.Today.AddDays(-i):d}")
                                                      .ToList();
    }
}
