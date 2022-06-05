using Microsoft.AspNetCore.Mvc;
using WepApi.Features.PlannedBudgetFutures.Commands;
using WepApi.Features.PlannedBudgetFutures.Queries;

namespace WepApi.Controllers.Api;

public class PlannedBudgetController : BaseController
{
    private readonly IMediator _mediator;

    public PlannedBudgetController(IMediator Mediator)
    {
        _mediator = Mediator;
    }

    /// <summary>
    ///  Get list of Planned Budget.
    /// </summary>
    [HttpGet("{budgetID}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Get([FromRoute] string budgetID)
    {
        return Ok(await _mediator.Send(new GetPlannedBudgetsQuery() { BudgetID = budgetID }));
    }

    /// <summary>
    /// Create Planned Budget.
    /// </summary>
    [HttpPost("{budgetID}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromRoute] string budgetID, [FromBody] CreatePlannedBudgetCommand command)
    {
        command.BudgetID = budgetID;
        return Ok(await _mediator.Send(command));
    }

    /// <summary>
    /// Update Planned Budget amount;
    /// </summary>
    [HttpPatch("{budgetID}/amount")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateAmount([FromRoute] string budgetID, [FromBody] UpdatePlannedBudgetAmountCommand command)
    {
        command.BudgetID = budgetID;
        return Ok(await _mediator.Send(command));
    }

    /// <summary>
    /// Delete Planned Budget.
    /// </summary>
    [HttpDelete("{budgetID}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Leave([FromRoute] string budgetID, [FromBody] DeletePlannedBudgetCommand command)
    {
        command.BudgetID = budgetID;
        return Ok(await _mediator.Send(command));
    }
}
