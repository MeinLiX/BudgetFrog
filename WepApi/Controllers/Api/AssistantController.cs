using Microsoft.AspNetCore.Mvc;
using WepApi.Features.AssistentFutures.Queries;

namespace WepApi.Controllers.Api
{
    public class AssistantController : BaseController
    {
        private readonly IMediator _mediator;

        public AssistantController(IMediator Mediator)
        {
            _mediator = Mediator;
        }

        /// <summary>
        /// 
        /// </summary>
        [HttpGet("analysis/{budgetID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAnalysisTransaction([FromRoute] string budgetID)
        {
            var date = DateTime.Now;
            return Ok(await _mediator.Send(new GetAnalysisTransactionInSelectedPeriodQuery() { BudgetID = budgetID, Year = date.Year, Month = date.Month, IncludeBanks = 1 }));
        }

        /// <summary>
        ///  
        /// </summary>
        [HttpGet("analysis/{budgetID}/{year}/{month}/{includeBanks}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAnalysisTransaction([FromRoute] string budgetID, [FromRoute] int year, [FromRoute] int month, [FromRoute] int includeBanks)
        {
            return Ok(await _mediator.Send(new GetAnalysisTransactionInSelectedPeriodQuery() { BudgetID = budgetID, Year = year, Month = month, IncludeBanks = includeBanks }));
        }

        [HttpPost("chat")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SendChatMessage([FromBody] SendChatMessageQuery query)
        {
            return Ok(await _mediator.Send(query));
        }
    }
}
