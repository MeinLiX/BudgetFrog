using Microsoft.AspNetCore.Mvc;

namespace BudgetFrogServer.Controllers
{
    public abstract class BaseController : ControllerBase
    {
        /// <summary>
        /// Method for extracting user ID
        /// </summary>
        protected int? GetUserId()
        {
            try
            {
                return int.Parse(User?.FindFirst("UserId")?.Value);
            }
            catch
            {
                return null;
            };
        }
    }
}
