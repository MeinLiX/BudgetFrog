using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using BudgetFrogServer.Models;
using BudgetFrogServer.Models.Basis;
using BudgetFrogServer.Utils;
using BudgetFrogServer.Utils.Charts.Transactions;

namespace BudgetFrogServer.Controllers
{
    [Route("[controller]")]
    [Authorize]
    [ApiController]
    public class TransactionController : BaseController
    {
        private readonly DB_Context _base_context;
        private readonly DB_ExchangeRatesContext _ER_context;

        public TransactionController(DB_Context base_context, DB_ExchangeRatesContext ER_context)
        {
            _base_context = base_context;
            _ER_context = ER_context;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult Get()
        {
            return Get(null);
        }

        [HttpGet("{days}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult Get(int? days)
        {
            try
            {
                int userId = GetUserId() ?? throw new Exception("Some error... Contact support or try again.");
                int daysAge = days ?? 0;
                List<Transaction> foundTransactions = daysAge switch
                {
                    <= 0 => _base_context.Transaction
                                         .Where(fc => fc.AppIdentityUser.ID == userId)
                                         .ToList(),

                    _ => _base_context.Transaction
                                          .Where(transaction =>
                                              transaction.AppIdentityUser.ID == userId &&
                                              (transaction.Date.AddDays(daysAge) >= DateTime.Now))
                                          .ToList()
                };

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

        [HttpGet("graph/{graphNumber}/{days}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GetGraph(int? graphNumber, int? days)
        {
            try
            {
                int userId = GetUserId() ?? throw new Exception("Some error... Contact support or try again.");

                TransactionCharts transactionCharts = new(_base_context, _ER_context);
                Chart chart = transactionCharts.BuildChart(graphNumber ?? 1, userId, days ?? 0);

                return new JsonResult(JsonSerialize.Data(
                        new
                        {
                            graph = chart
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

        [HttpGet("group")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GetGroup()
        {
            try
            {
                int userId = GetUserId() ?? throw new Exception("Some error... Contact support or try again.");
                var foundTransactions = _base_context.Transaction
                                          .Include(transaction => transaction.TransactionCategory)
                                          .Include(transaction => transaction.AppIdentityUser)
                                          .Where(transaction => transaction.AppIdentityUser.ID == userId)
                                          .ToList();

                Dictionary<string, List<Transaction>> transactions = new();
                foundTransactions.OrderByDescending(t => t.Date).ToList().ForEach(transaction =>
                {
                    string keyDate = $"{transaction.Date:d}";
                    if (transactions.ContainsKey(keyDate))
                    {
                        transactions[keyDate].Add(transaction);
                    }
                    else
                    {
                        transactions.Add(keyDate, new List<Transaction>() { transaction });
                    }
                });

                return new JsonResult(JsonSerialize.Data(
                        new
                        {
                            transactions = transactions
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
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Post([FromForm] Transaction transaction)
        {
            try
            {
                int userId = GetUserId() ?? throw new Exception("Some error... Contact support or try again.");

                #region Trying to add a new Transaction to the database
                if (!transaction.IsValidDate())
                    throw new Exception("Invalid date!");

                var transactionCategory = _base_context.TransactionCategory.FirstOrDefaultAsync(tc => tc.ID == transaction.TransactionCategoryID && tc.AppIdentityUser.ID == userId);

                var newTransaction = new Transaction
                {
                    Balance = transaction.Balance,
                    Date = transaction.Date,
                    Currency = transaction.Currency,
                    Notes = transaction.Notes,
                    TransactionCategory = (await transactionCategory) ?? throw new Exception("Transaction category not found."),
                    RecepitBinary = transaction?.RecepitBinary,
                    AppIdentityUser = _base_context.AppIdentityUser.FirstOrDefault(u => u.ID == userId),
                };

                _base_context.Transaction.Add(newTransaction);

                #region User balance
                var exchangeRates = await _ER_context.ExchangeRates
                                              .Include(er => er.results)
                                              .OrderByDescending(er => er.ID)
                                              .FirstOrDefaultAsync();

                decimal transactionBalance = (decimal)exchangeRates.Convert(newTransaction.Currency, newTransaction.AppIdentityUser.Currency, (float)newTransaction.Balance);
                newTransaction.AppIdentityUser.Balance += (newTransaction.TransactionCategory.Income ?? true) ? transactionBalance : -transactionBalance;
                #endregion
                await _base_context.SaveChangesAsync();
                #endregion

                return new JsonResult(JsonSerialize.Data(
                       new
                       {
                           UserBalance = newTransaction.AppIdentityUser.Balance,
                           UserCurrency = newTransaction.AppIdentityUser.Currency,
                           transaction = newTransaction,
                       },
                       "Transaction was created"))
                {
                    StatusCode = StatusCodes.Status201Created
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

        [HttpPatch]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Patch([FromBody] Transaction transactionBODY)
        {
            try
            {
                int userId = GetUserId() ?? throw new Exception("Some error... Contact support or try again.");
                #region Trying to add a new Transaction to the database
                if (!transactionBODY.IsValidDate())
                    throw new Exception("Invalid date!");

                var transactionFound = await _base_context.Transaction
                                                   .Include(t => t.AppIdentityUser)
                                                   .FirstOrDefaultAsync(transactionQ => transactionQ.ID == transactionBODY.ID && transactionQ.AppIdentityUser.ID == userId);

                _ = transactionFound ?? throw new Exception("Transaction not found.");

                if (transactionFound == transactionBODY)
                    throw new Exception("Transaction already up.");

                var transactionCategory = _base_context.TransactionCategory
                                               .FirstOrDefaultAsync(tc => tc.ID == transactionBODY.TransactionCategoryID && tc.AppIdentityUser.ID == userId);

                transactionFound.Balance = transactionBODY.Balance;
                transactionFound.Date = transactionBODY.Date;
                transactionFound.Currency = transactionBODY.Currency;
                transactionFound.Notes = transactionBODY.Notes;
                transactionFound.TransactionCategory = (await transactionCategory) ?? throw new Exception("Transaction category not found.");
                transactionFound.RecepitBinary = transactionBODY?.RecepitBinary;

                _base_context.Transaction.Update(transactionFound);

                #region User balance
                var exchangeRates = await _ER_context.ExchangeRates
                                              .Include(er => er.results)
                                              .OrderByDescending(er => er.ID)
                                              .FirstOrDefaultAsync();

                decimal transactionBalance = (decimal)exchangeRates.Convert(transactionFound.Currency, transactionFound.AppIdentityUser.Currency, (float)transactionFound.Balance);
                transactionFound.AppIdentityUser.Balance += (transactionFound.TransactionCategory.Income ?? true) ? transactionBalance : -transactionBalance;
                #endregion
                await _base_context.SaveChangesAsync();
                #endregion

                return new JsonResult(JsonSerialize.Data(
                       new
                       {
                           UserBalance = transactionFound.AppIdentityUser.Balance,
                           UserCurrency = transactionFound.AppIdentityUser.Currency,
                           transaction = transactionFound,
                       },
                       "Transaction was updated"))
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

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                int userId = GetUserId() ?? throw new Exception("Some error... Contact support or try again.");

                #region Trying to remove a Transaction from the database
                var foundTransaction = _base_context.Transaction
                                                .Include(t => t.AppIdentityUser)
                                                .Include(t => t.TransactionCategory)
                                                .FirstOrDefault(transaction => transaction.ID == id
                                                                 && transaction.AppIdentityUser.ID == userId);

                _ = foundTransaction ?? throw new Exception("Transaction not found.");

                #region User balance
                var exchangeRates = await _ER_context.ExchangeRates
                                              .Include(er => er.results)
                                              .OrderByDescending(er => er.ID)
                                              .FirstOrDefaultAsync();

                decimal transactionBalance = (decimal)exchangeRates.Convert(foundTransaction.Currency, foundTransaction.AppIdentityUser.Currency, (float)foundTransaction.Balance);
                foundTransaction.AppIdentityUser.Balance -= (foundTransaction.TransactionCategory.Income ?? true) ? transactionBalance : -transactionBalance;
                #endregion
                _base_context.Transaction.Remove(foundTransaction);
                await _base_context.SaveChangesAsync();
                #endregion



                #region shear adjustment balance
                var AnyTransactions = await _base_context.Transaction
                                                    .Include(t => t.AppIdentityUser)
                                                    .Where(t => t.AppIdentityUser.ID == userId)
                                                    .AnyAsync();
                if (!AnyTransactions)
                {
                    foundTransaction.AppIdentityUser.Balance = 0m;
                    await _base_context.SaveChangesAsync();
                }
                #endregion

                return new JsonResult(JsonSerialize.Data(
                       new
                       {
                           UerBalance = foundTransaction.AppIdentityUser.Balance,
                           transaction = new Transaction()
                           {
                               ID = foundTransaction.ID,
                               Balance = foundTransaction.Balance,
                               Currency = foundTransaction.Currency,
                               TransactionCategoryID = foundTransaction.TransactionCategoryID
                           },
                       }, "Transaction was deleted."))
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
