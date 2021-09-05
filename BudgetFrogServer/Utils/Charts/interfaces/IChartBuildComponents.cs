using BudgetFrogServer.Models.Basis;
using System.Collections.Generic;

namespace BudgetFrogServer.Utils.Charts.interfaces
{
    interface IChartBuildComponents
    {
        Chart BuildChart();
        //List<string> GetLabels();
        //List<int> GetDataSetBarData();
        //List<int> GetDataSetLineData();
    }
}
