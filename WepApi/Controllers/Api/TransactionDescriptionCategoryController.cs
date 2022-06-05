using Microsoft.AspNetCore.Mvc;
using WepApi.Features.TransactionDescriptionCategoryFutures.Commands;
using WepApi.Features.TransactionDescriptionCategoryFutures.Queries;

namespace WepApi.Controllers.Api;

public class TransactionDescriptionCategoryController : BaseController
{
    private readonly IMediator _mediator;

    public TransactionDescriptionCategoryController(IMediator Mediator)
    {
        _mediator = Mediator;
    }

    /// <summary>
    /// Get list of categories.  
    /// </summary>
    [HttpGet("{budgetID}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetCategories([FromRoute] string budgetID)
    {
        return Ok(await _mediator.Send(new GetBudgetCategoriesQuery() { BudgetID = budgetID }));
    }

    /// <summary>
    /// Get category.  
    /// </summary>
    [HttpGet("{budgetID}/{categoryID}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetCategory([FromRoute] string budgetID, [FromRoute] string categoryID)
    {
        return Ok(await _mediator.Send(new GetBudgetCategoryByCategoryIdQuery() { BudgetID = budgetID, CategoryID = categoryID }));
    }

    /// <summary>
    /// Create category.
    /// </summary>
    [HttpPost("{budgetID}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateCategory([FromRoute] string budgetID, [FromBody] CreateCategoryCommand command)
    {
        command.BudgetID = budgetID;
        return Ok(await _mediator.Send(command));
    }

    /// <summary>
    /// Update category. 
    /// </summary>
    [HttpPatch("{budgetID}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateCategory([FromRoute] string budgetID, [FromBody] UpdateCategoryCommand command)
    {
        command.BudgetID = budgetID;
        return Ok(await _mediator.Send(command));
    }

    /// <summary>
    /// Delete category. 
    /// </summary>
    [HttpDelete("{budgetID}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteCategory([FromRoute] string budgetID, [FromBody] DeleteCategoryCommand command)
    {
        command.BudgetID = budgetID;
        return Ok(await _mediator.Send(command));
    }
}
