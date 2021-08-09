using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using BudgetFrogServer.Utils;

namespace BudgetFrogServer.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        /// <summary>
        /// Check server activity.
        /// </summary>
        [HttpGet("ping")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Ping() => new JsonResult(JsonSerialize.MessageText("Pong!"))
        {
            StatusCode = StatusCodes.Status200OK
        };

        /// <summary>
        /// Check user authenticated.
        /// </summary>      
        [HttpGet("IsAuth")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult IsAuth() => User.Identity.IsAuthenticated switch
        {
            true => new JsonResult(JsonSerialize.MessageText("User is Auth!"))
            {
                StatusCode = StatusCodes.Status200OK
            },

            false => new JsonResult(JsonSerialize.ErrorMessageText("User is not Auth!"))
            {
                StatusCode = StatusCodes.Status401Unauthorized
            }
        };
    }
}
