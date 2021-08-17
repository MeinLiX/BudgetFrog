﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using BudgetFrogServer.Models;
using BudgetFrogServer.Models.Basis;
using BudgetFrogServer.Utils;


namespace BudgetFrogServer.Controllers
{
    [Route("[controller]")]
    [Authorize]
    [ApiController]
    public class TransactionCategoryController : BaseController
    {
        private readonly DB_Context _base_context;

        public TransactionCategoryController(DB_Context base_context)
        {
            _base_context = base_context;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult Get()
        {
            try
            {
                int userId = GetUserId() ?? throw new Exception("Some error... Contact support or try again.");

                var foundCategories = _base_context.TransactionCategory
                                          .Where(category => category.AppIdentityUser.ID == userId)
                                          .ToList();

                return new JsonResult(JsonSerialize.Data(
                        new
                        {
                            TransactionCategories = foundCategories
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

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult Get(int id)
        {
            try
            {
                int userId = GetUserId() ?? throw new Exception("Some error... Contact support or try again.");

                var foundCategories = _base_context.TransactionCategory
                                              .FirstOrDefault(category => category.ID == id
                                                                 && category.AppIdentityUser.ID == userId);

                return foundCategories switch
                {
                    not null => new JsonResult(JsonSerialize.Data(foundCategories))
                    {
                        StatusCode = StatusCodes.Status200OK
                    },
                    _ => new JsonResult(JsonSerialize.Data(null, "Transaction category not found."))
                    {
                        StatusCode = StatusCodes.Status200OK
                    }
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
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Post([FromBody] TransactionCategory transactionCategory)
        {
            try
            {
                int userId = GetUserId() ?? throw new Exception("Some error... Contact support or try again.");

                #region Trying to add a new Transaction Category to the database
                var tc = new TransactionCategory
                {
                    Name = transactionCategory?.Name,
                    Income = transactionCategory.Income,
                    AppIdentityUser = _base_context.AppIdentityUser.FirstOrDefault(u => u.ID == userId),
                };
                _base_context.TransactionCategory.Add(tc);
                await _base_context.SaveChangesAsync();
                #endregion

                return new JsonResult(JsonSerialize.Data(
                       new
                       {
                           TransactionCategory = tc
                       },
                       "Transaction category was created"))
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

        [HttpPut("{id}")]
        //       [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public IActionResult Put(int id, [FromBody] TransactionCategory transactionCategory)
        {
            try
            {
                int userId = GetUserId() ?? throw new Exception("Some error... Contact support or try again.");

                return new JsonResult(JsonSerialize.MessageText("A response to the request is being developed."))
                {
                    StatusCode = StatusCodes.Status403Forbidden
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

                var foundCategory = _base_context.TransactionCategory
                                              .FirstOrDefault(category => category.ID == id
                                                                 && category.AppIdentityUser.ID == userId);

                if (foundCategory is null)
                {
                    return new JsonResult(JsonSerialize.Data(null, "Transaction category not found."))
                    {
                        StatusCode = StatusCodes.Status200OK
                    };
                }

                _base_context.TransactionCategory.Remove(foundCategory);
                await _base_context.SaveChangesAsync();

                return new JsonResult(JsonSerialize.Data(foundCategory), "Transaction category was deleted.")
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
