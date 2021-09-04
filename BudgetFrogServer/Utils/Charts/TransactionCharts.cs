using BudgetFrogServer.Models.Basis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BudgetFrogServer.Utils.Charts
{
    public class TransactionCharts
    {
        private readonly List<Transaction> _transactions;
        private readonly List<TransactionCategory> _transactionCategories;
        private int LastDays { get; set; }
        public TransactionCharts(List<Transaction> transactions, List<TransactionCategory> transactionCategories)
        {
            _transactions = transactions;
            _transactionCategories = transactionCategories;
        }


        public TransactionGraph.Bar BuildBar(int lastDays = 7)
        {
            TransactionGraph.Bar Bar = new();
            LastDays = lastDays;

            List<string> labels = GetLabels();
            Bar.labels.AddRange(labels);
            _transactionCategories
                .ForEach(tc => Bar.datasets.Add(new TransactionGraph.DataSet(
                    type: "bar",
                    label: tc.Name,
                    backgroundColor: tc.Color,
                    borderWidth: 2,
                    fill: true,
                    data: GetDataSetBarData(labels)
            )));

            Bar.datasets.Add(new TransactionGraph.DataSet(
                    type: "line",
                    label: "User balance",
                    backgroundColor: "rgba(17,140,79,0.1)", //green like money c:
                    borderWidth: 4,
                    fill: true,
                    data: GetDataSetLineData(labels)
            ));

            return Bar;
        }

        private List<string> GetLabels() => Enumerable.Range(1, LastDays)
                                                      .Select(i => $"{DateTime.Today.AddDays(-i):d}")
                                                      .ToList();

        private List<int> GetDataSetBarData(List<string> labels)
        {
            List<int> data = new();
            data.AddRange(Enumerable.Range(1, new Random().Next(LastDays))
                                    .Select(i => new Random().Next(-50, 50)));
            return data;
        }

        private List<int> GetDataSetLineData(List<string> labels)
        {
            List<int> data = new();
            data.AddRange(Enumerable.Range(1, new Random().Next(LastDays - 1))
                                    .Select(i => new Random().Next(-50, 50)));

            int lastBalance = data[^1];
            data.AddRange(Enumerable.Range(0, LastDays - data.Count)
                                    .Select(i => lastBalance));
            return data;
        }
    }
}
