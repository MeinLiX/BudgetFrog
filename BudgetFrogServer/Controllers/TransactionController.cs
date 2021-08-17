using BudgetFrogServer.Models;
using BudgetFrogServer.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BudgetFrogServer.Controllers
{
    [Route("[controller]")]
    //[Authorize]
    [ApiController]
    public class TransactionController:BaseController
    {
        private readonly DB_ExchangeRatesContext _ER_context;

        public TransactionController(DB_ExchangeRatesContext ER_context)
        {
            _ER_context = ER_context;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult Get()
        {
            try
            {
                int userId = GetUserId() ?? throw new Exception("Some error... Contact support or try again.");

                return new JsonResult(JsonSerialize.MessageText("TRANSACTION"))
                {
                    StatusCode = StatusCodes.Status200OK
                };

            }
            catch (Exception ex)
            {
                return new JsonResult(JsonSerialize.ErrorMessageText(ex.Message))
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }
        }
    }
}
