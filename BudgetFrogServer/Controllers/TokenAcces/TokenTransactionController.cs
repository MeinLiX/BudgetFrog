using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using BudgetFrogServer.Models;
using BudgetFrogServer.Models.Basis;
using BudgetFrogServer.Utils;
using Microsoft.EntityFrameworkCore;

namespace BudgetFrogServer.Controllers.TokenAcces
{
    [Route("token/transaction")]
    [ApiController]
    public class TokenTransactionController : ControllerBase
    {
        private readonly DB_Context _base_context;
        private readonly DB_ExchangeRatesContext _ER_context;

        public TokenTransactionController(DB_Context base_context, DB_ExchangeRatesContext ER_context)
        {
            _base_context = base_context;
            _ER_context = ER_context;
        }

        [HttpGet("{external_token}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult Get(string external_token)
        {
            try
            {
                List<Transaction> foundTransactions = _base_context.Transaction
                                         .Include(t=>t.TransactionCategory)
                                         .Where(fc => fc.AppIdentityUser.ExternalToken.ToString() == external_token)
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
