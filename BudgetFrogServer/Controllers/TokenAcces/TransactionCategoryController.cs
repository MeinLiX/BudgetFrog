﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Collections.Generic;
using BudgetFrogServer.Models;
using BudgetFrogServer.Models.Basis;
using BudgetFrogServer.Utils;

namespace BudgetFrogServer.Controllers.TokenAcces
{
    [Route("token/transaction/category")]
    [ApiController]
    public class TransactionCategoryController : ControllerBase
    {
        private readonly DB_Context _base_context;

        public TransactionCategoryController(DB_Context base_context)
        {
            _base_context = base_context;
        }

        [HttpGet("{external_token}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult Get(string external_token)
        {
            try
            {

                List<TransactionCategory> foundCategories = _base_context.TransactionCategory
                                          .Where(category => category.AppIdentityUser.ExternalToken.ToString() == external_token)
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
    }
}