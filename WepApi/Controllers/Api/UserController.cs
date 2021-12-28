using Microsoft.AspNetCore.Mvc;
using WepApi.Features.UserFutures.Commands;

namespace WepApi.Controllers.Api;

public class UserController : BaseController
{
    private IMediator _mediator;

    protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> LogInUser([FromBody] LoginCommand command)
    {
        return Ok(await Mediator.Send(command));
    }

    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> LogUpUser([FromBody] RegisterCommand command)
    {
        return Ok(await Mediator.Send(command));
    }

}
