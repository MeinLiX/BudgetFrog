using Microsoft.AspNetCore.Mvc;
using WepApi.Features.TransactionDescriptionFutures.Commands;
using WepApi.Features.TransactionDescriptionFutures.Queries;

namespace WepApi.Controllers.Api;

public class TransactionDescriptionController : BaseController
{
    private readonly IMediator _mediator;

    public TransactionDescriptionController(IMediator Mediator)
    {
        _mediator = Mediator;
    }

    /// <summary>
    /// Get list of transactions.  
    /// </summary>
    [HttpGet("{budgetID}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetTransactions([FromRoute] string budgetID)
    {
        var date = DateTime.Now;
        return Ok(await _mediator.Send(new GetBudgetTransactionLastDaysQuery() { BudgetID = budgetID, Year = date.Year, Month = date.Month }));
    }

    /// <summary>
    /// Get list of transactions. 
    /// </summary>
    [HttpGet("{budgetID}/{year}/{month}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetTransaction([FromRoute] string budgetID, [FromRoute] int year, [FromRoute] int month)
    {
        return Ok(await _mediator.Send(new GetBudgetTransactionLastDaysQuery() { BudgetID = budgetID, Year = year, Month = month }));
    }

    /// <summary>
    /// Create transaction.
    /// </summary>
    [HttpPost("{budgetID}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateTransaction([FromRoute] string budgetID, [FromBody] CreateTransactionCommand command)
    {
        command.BudgetID = budgetID;
        return Ok(await _mediator.Send(command));
    }

    /// <summary>
    /// Update transaction. 
    /// </summary>
    [HttpPatch("{budgetID}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateTransaction([FromRoute] string budgetID/*, [FromBody] UpdateTransactionCommand command*/)
    {
        //command.BudgetID = budgetID;
        return BadRequest();//Ok(await _mediator.Send(command));
    }

    /// <summary>
    /// Delete transaction. 
    /// </summary>
    [HttpDelete("{budgetID}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteTransaction([FromRoute] string budgetID, [FromBody] DeleteTransactionCommand command)
    {
        command.BudgetID = budgetID;
        return Ok(await _mediator.Send(command));
    }
}
