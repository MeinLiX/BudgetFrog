using BudgetFrogServer.Models.Basis;
using System.Threading.Tasks;

namespace BudgetFrogServer.Utils.Charts.interfaces
{
    interface IChartBuildComponents
    {
        Chart BuildChart();
        Task InitialData();
    }
}
