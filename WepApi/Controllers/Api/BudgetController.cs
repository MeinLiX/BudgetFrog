using Microsoft.AspNetCore.Mvc;
using WepApi.Features.BudgetFutures.Commands;
using WepApi.Features.BudgetFutures.Queries;

namespace WepApi.Controllers.Api;

public class BudgetController : BaseController
{
    private readonly IMediator _mediator;

    public BudgetController(IMediator Mediator)
    {
        _mediator = Mediator;
    }

    [HttpGet()]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Get()
    {
        return Ok(await _mediator.Send(new GetBudgetsByUserIdQuery()));
    }
    
    [HttpPost("create")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateBudgetCommand command)
    {
        return Ok(await _mediator.Send(command));
    }
    
    [HttpPatch("update/{BudgetID}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(string BudgetID/*todo*/)
    {
        return BadRequest();
    }
    
    [HttpDelete("delete/{BudgetID}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Delete(string BudgetID/*todo*/)
    {
        return BadRequest();
    }
    
    [HttpPost("invite/{BudgetID}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Invite(string BudgetID/*todo*/)
    {
        return BadRequest();
    }
    
    [HttpPost("accept/{InviteToken}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Accept(string InviteToken/*todo*/)
    {
        return BadRequest();
    } 
    
    [HttpPost("leave/{BudgetID}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Leave(string BudgetID/*todo*/)
    {
        return BadRequest();
    }
}
