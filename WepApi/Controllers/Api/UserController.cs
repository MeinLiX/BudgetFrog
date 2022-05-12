using Microsoft.AspNetCore.Mvc;
using WepApi.Features.UserFutures.Commands;
using WepApi.Features.UserFutures.Queries;

namespace WepApi.Controllers.Api;

public class UserController : BaseController
{
    private readonly IMediator _mediator;

    public UserController(IMediator Mediator)
    {
        _mediator = Mediator;
    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> LogInUser([FromBody] LoginCommand command)
    {
        return Ok(await _mediator.Send(command));
    }

    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> LogUpUser([FromBody] RegisterCommand command)
    {
        return Ok(await _mediator.Send(command));
    }
    
    [HttpGet("me")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetMe()
    {
        return Ok(await _mediator.Send(new GetAuthUserDetailsQuery()));
    }

}
