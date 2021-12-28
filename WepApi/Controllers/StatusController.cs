using Microsoft.AspNetCore.Mvc;
using WepApi.Utils.Wrapper;

namespace WepApi.Controllers;

public class StatusController : BaseController
{

    /// <summary>
    /// Check server activity.
    /// </summary>
    [HttpGet("ping")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult Ping() => Ok(Result.Success("Pong!"));

    /// <summary>
    /// Check user authenticated.
    /// </summary>      
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult IsAuth() => User.Identity.IsAuthenticated switch
    {
        true => Ok(Result.Success("User is Auth!")),
        false => Unauthorized(Result.Fail("User is not Auth!"))
    };
}
