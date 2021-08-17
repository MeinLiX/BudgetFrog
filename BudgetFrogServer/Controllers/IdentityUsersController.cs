using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

using BudgetFrogServer.Models;
using BudgetFrogServer.Models.Auth;
using BudgetFrogServer.Models.Basis;
using BudgetFrogServer.Utils;
using Microsoft.AspNetCore.Authorization;

namespace BudgetFrogServer.Controllers
{
    [Route("")]
    [ApiController]
    public class IdentityUsersController : BaseController
    {
        private readonly DB_Context _base_context;

        public IdentityUsersController(DB_Context base_context)
        {
            _base_context = base_context;
        }

        [HttpGet("me")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult Get()
        {
            try
            {
                int userId = GetUserId() ?? throw new Exception("Some error... Contact support or try again.");

                var user = _base_context.AppIdentityUser
                                          .Where(user => user.ID == userId)
                                          .Select(user => new { user.ID, user.Email, user.FirstName, user.LastName, user.Balance, user.Currency })
                                          .FirstOrDefault();
                if (user is null)
                {
                    throw new Exception("Some error... Contact support or try again.");
                }


                return new JsonResult(JsonSerialize.Data(
                        new
                        {
                            user
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

        /// <summary>
        /// User authorization.
        /// </summary>
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> LogInUser([FromBody] AppIdentityUser authUser)
        {

            IllegalActionsWithInputData(authUser);

            if (User.Identity.IsAuthenticated)
            {
                return new JsonResult(JsonSerialize.ErrorMessageText("You already log in."))
                {
                    StatusCode = StatusCodes.Status200OK
                };
            }

            var identity = await GetIdentity(authUser);
            if (identity is null)
            {
                return new JsonResult(JsonSerialize.ErrorMessageText("Invalid email or password."))
                {
                    StatusCode = StatusCodes.Status400BadRequest
                };
            }

            User.AddIdentity(identity);

            return new JsonResult(JsonSerialize.Data(
                new
                {
                    token = JWT.GenerateToken(identity.Claims),
                    username = identity.Name
                }))
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        /// <summary>
        /// Registration a User. 
        /// </summary>
        [HttpPost("logup")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> LogUpUser([FromBody] AppIdentityUser authUser)
        {
            IllegalActionsWithInputData(authUser);
            if (User.Identity.IsAuthenticated)
            {
                return new JsonResult(JsonSerialize.ErrorMessageText("You already log in."))
                {
                    StatusCode = StatusCodes.Status200OK
                };
            }

            try
            {
                #region Trying to add a new user to the database
                var NameValid = _base_context.AppIdentityUser.Where(o => o.Email.ToLower() == authUser.Email.ToLower()).FirstOrDefault();
                if (NameValid is not null)
                    throw new Exception("Login is already taken.");

                var newIdentityUser = new AppIdentityUser
                {
                    Email = authUser.Email,
                    Password = CryptoHash.GetHashValue(authUser.Password),
                    FirstName = authUser?.FirstName,
                    LastName = authUser?.LastName
                };
                _base_context.AppIdentityUser.Add(newIdentityUser);
                await _base_context.SaveChangesAsync();
                #endregion

                #region Adding default TransactionCategories for new user
                _base_context.TransactionCategory.AddRange(new[] {
                    new TransactionCategory()
                    {
                        Name = "Housing",
                        Income = false,
                        AppIdentityUser = newIdentityUser
                    },
                    new TransactionCategory()
                    {
                        Name = "Transport",
                        Income = false,
                        AppIdentityUser = newIdentityUser
                    },
                    new TransactionCategory()
                    {
                        Name = "Food",
                        Income = false,
                        AppIdentityUser = newIdentityUser
                    },
                    new TransactionCategory()
                    {
                        Name = "Utilities",
                        Income = false,
                        AppIdentityUser = newIdentityUser
                    },
                    new TransactionCategory()
                    {
                        Name = "Entertainment",
                        Income = false,
                        AppIdentityUser = newIdentityUser
                    },
                    new TransactionCategory()
                    {
                        Name = "Scholarship",
                        Income = true,
                        AppIdentityUser = newIdentityUser
                    },
                    new TransactionCategory()
                    {
                        Name = "Salary",
                        Income = true,
                        AppIdentityUser = newIdentityUser
                    }
                });

                await _base_context.SaveChangesAsync();
                #endregion

                var identity = await GetIdentity(authUser);
                if (identity is null)
                    throw new Exception("Some error... Contact support or try again.");
                User.AddIdentity(identity);

                return new JsonResult(JsonSerialize.Data(
                    new
                    {
                        token = JWT.GenerateToken(identity.Claims),
                        username = identity.Name
                    }))
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

        /// <summary>
        /// TOTAL SECRET, SORRY!
        /// </summary>
        private static bool IllegalActionsWithInputData(AppIdentityUser user)
        {
            try
            {
                user.Email = user.Email.Trim().ToLower();
                user.LastName = user?.LastName?.Trim()?.ToLower();
                user.FirstName = user?.FirstName?.Trim()?.ToLower();
            }
            catch
            {
                return false;
            }
            return true;
        }

        /// <summary>
        /// Searching user in db and validation of password.
        /// </summary>
        private async Task<ClaimsIdentity> GetIdentity(AppIdentityUser loggingUser)
        {
            if (loggingUser is not null)
            {
                AppIdentityUser FoundUser = await _base_context.AppIdentityUser.FirstOrDefaultAsync(x => x.Email == loggingUser.Email);
                if (FoundUser is not null && CryptoHash.EqualHashValue(loggingUser.Password, FoundUser?.Password))
                {
                    List<Claim> claims = new()
                    {
                        new Claim(ClaimsIdentity.DefaultNameClaimType, FoundUser.Email),
                        new Claim("UserId", $"{FoundUser.ID}"),
                    };

                    return new(
                        claims: claims,
                        authenticationType: "Token",
                        nameType: ClaimsIdentity.DefaultNameClaimType,
                        roleType: ClaimsIdentity.DefaultRoleClaimType);
                }
            }

            return null;
        }
    }
}
