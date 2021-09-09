using BudgetFrogServer.Models;
using BudgetFrogServer.Models.ER_Basis;
using BudgetFrogServer.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BudgetFrogServer.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ExchangerController : BaseController
    {
        private readonly DB_ExchangeRatesContext _ER_context;

        public ExchangerController(DB_ExchangeRatesContext ER_context)
        {
            _ER_context = ER_context;
        }

        [HttpGet("all")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Get()
        {
            try
            {
                var exchangeRates = await _ER_context.ExchangeRates
                                                .Include(er => er.results)
                                                .OrderByDescending(er => er.ID)
                                                .FirstOrDefaultAsync();

                return new JsonResult(JsonSerialize.Data(
                        new
                        {
                            exchangeRates
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

        [HttpGet("available")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult AvailableCurrencies()
        {
            try
            {
                return new JsonResult(JsonSerialize.Data(
                        new
                        {
                            currencies = Constants.Currencies.Split("|")
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

        [HttpGet("one")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Get(string from, string to)
        {
            try
            {
                if (from is null || to is null)
                    throw new Exception("Uncorrect from or(and) to");

                var exchangeRates = await _ER_context.ExchangeRates
                                                .Include(er => er.results)
                                                .OrderByDescending(er => er.ID)
                                                .FirstOrDefaultAsync();

                return new JsonResult(JsonSerialize.Data(
                        new
                        {
                            from,
                            to,
                            rate = exchangeRates.GetRate(from, to)
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

        [HttpGet("convert")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Get(string from, string to, float amount)
        {
            try
            {
                if (from is null || to is null)
                    throw new Exception("Uncorrect from or(and) to");
                if (amount < 0)
                    throw new Exception("Uncorrect amount");

                var exchangeRates = await _ER_context.ExchangeRates
                                                .Include(er => er.results)
                                                .OrderByDescending(er => er.ID)
                                                .FirstOrDefaultAsync();

                return new JsonResult(JsonSerialize.Data(
                        new
                        {
                            from,
                            fromAmount = amount,
                            to,
                            toAmount = exchangeRates.Convert(from, to, amount),
                            rate = exchangeRates.GetRate(from, to)
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
