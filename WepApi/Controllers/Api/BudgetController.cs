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

    /// <summary>
    ///  Get list of user's own Budgets with details.
    /// </summary>
    [HttpGet("")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Get()
    {
        return Ok(await _mediator.Send(new GetUserBudgetsQuery()));
    }

    /// <summary>
    /// Get user's own Budget with details.
    /// </summary>
    [HttpGet("{budgetID}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Get(string budgetID)
    {
        return Ok(await _mediator.Send(new GetUserBudgetByBudgetIdQuery() { BudgetID = budgetID }));
    }

    /// <summary>
    /// Create Budget.
    /// </summary>
    [HttpPost("")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateBudgetCommand command)
    {
        return Ok(await _mediator.Send(command));
    }

    /// <summary>
    /// Ubdate Budget;
    /// </summary>
    [HttpPatch("")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update([FromBody] UpdateBudgetCommand command)
    {
        return Ok(await _mediator.Send(command));
    }

    /// <summary>
    /// Generate new token for invite another users into own Budget.
    /// </summary>
    [HttpPatch("token")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GenerateInviteToken([FromBody] GenerateInviteTokenBudgetCommand command)
    {
        return Ok(await _mediator.Send(command));
    }

    /// <summary>
    /// Remove token for disable invite other users into own Budget.
    /// </summary>
    [HttpDelete("token")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeactivateInviteToken([FromBody] DeactivateInviteTokenBudgetCommand command)
    {
        return Ok(await _mediator.Send(command));
    }

    /// <summary>
    /// Join to Budget.
    /// </summary>
    [HttpPatch("join/{InviteToken}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Join(string InviteToken)
    {
        return Ok(await _mediator.Send(new JoinBudgetCommand() { InviteToken = InviteToken }));
    }

    /// <summary>
    /// Leave from Budget (If the user is last, Budget will be deleted)
    /// </summary>
    [HttpDelete("leave")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Leave([FromBody] LeaveBudgetCommand command)
    {
        return Ok(await _mediator.Send(command));
    }

    /// <summary>
    /// Add privat24 creds.
    /// </summary>
    [HttpPatch("{budgetID}/privat24")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddP24([FromRoute] string budgetID, [FromBody] AddP24credentialCommand command)
    {
        command.BudgetID = budgetID;
        return Ok(await _mediator.Send(command));
    }

    /// <summary>
    /// Add privat24 creds.
    /// </summary>
    [HttpDelete("{budgetID}/privat24")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RemoveP24([FromRoute] string budgetID, [FromBody] RemoveP24credentialCommand command)
    {
        command.BudgetID = budgetID;
        return Ok(await _mediator.Send(command));
    }
}
