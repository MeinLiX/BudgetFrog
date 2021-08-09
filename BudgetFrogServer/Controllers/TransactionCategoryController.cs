using Microsoft.AspNetCore.Http;
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
        private readonly DB_Context _context;

        public TransactionCategoryController(DB_Context context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                int userId = GetUserId() ?? throw new Exception("Some error... Contact support or try again.");

                var foundCategories = _context.TransactionCategory
                                          .Where(category => category.IdentityUser.UserId == userId)
                                          .ToList();

                return foundCategories switch
                {
                    not null => new JsonResult(JsonSerialize.Data(foundCategories))
                    {
                        StatusCode = StatusCodes.Status200OK
                    },
                    _ => new JsonResult(JsonSerialize.Data(Array.Empty<object>()))
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

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            try
            {
                int userId = GetUserId() ?? throw new Exception("Some error... Contact support or try again.");

                var foundCategories = _context.TransactionCategory
                                              .FirstOrDefault(category => category.TransactionCategoryId == id
                                                                 && category.IdentityUser.UserId == userId);

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
        public IActionResult Post([FromBody] TransactionCategory transactionCategory)
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

        [HttpPut("{id}")]
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
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                int userId = GetUserId() ?? throw new Exception("Some error... Contact support or try again.");

                var foundCategory = _context.TransactionCategory
                                              .FirstOrDefault(category => category.TransactionCategoryId == id
                                                                 && category.IdentityUser.UserId == userId);

                if (foundCategory is null)
                {
                    return new JsonResult(JsonSerialize.Data(null, "Transaction category not found."))
                    {
                        StatusCode = StatusCodes.Status200OK
                    };
                }

                _context.TransactionCategory.Remove(foundCategory);
                await _context.SaveChangesAsync();

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
