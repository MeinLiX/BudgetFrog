using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using BudgetFrogServer.Models;
using BudgetFrogServer.Models.Basis;
using BudgetFrogServer.Utils;

namespace BudgetFrogServer.Controllers.TokenAcces
{
    [Route("token/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly DB_Context _base_context;
        private readonly DB_ExchangeRatesContext _ER_context;

        public TransactionController(DB_Context base_context, DB_ExchangeRatesContext ER_context)
        {
            _base_context = base_context;
            _ER_context = ER_context;
        }

        [HttpGet("{ExternalToken}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult Get(string ExternalToken)
        {
            try
            {
                List<Transaction> foundTransactions = _base_context.Transaction
                                         .Where(fc => fc.AppIdentityUser.ExternalToken.ToString() == ExternalToken)
                                         .ToList();


                return new JsonResult(JsonSerialize.Data(
                        new
                        {
                            transactions = foundTransactions
                        }))
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
