using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WepApi.Features.UserFutures.Commands;

namespace WepApi.Controllers.Api;

public class UserController : BaseController
{
    private IMediator _mediator;

    protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

    /// <summary>
    /// User authorization.
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> LogInUser([FromBody] RegisterCommand command)
    {
        //User
        //authUser
        return Ok(await Mediator.Send(command));
    }
    
}
