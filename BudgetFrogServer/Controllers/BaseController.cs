using Microsoft.AspNetCore.Mvc;

namespace BudgetFrogServer.Controllers
{
    public abstract class BaseController : ControllerBase
    {
        /// <summary>
        /// Method for extracting user ID
        /// </summary>
        public int? GetUserId()
        {
            if (int.TryParse(User.FindFirst("UserId").Value, out int userId))
                return userId;
            else return null;
        }
    }
}
