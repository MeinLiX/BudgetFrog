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

namespace BudgetFrogServer.Controllers
{
    [Route("")]
    [ApiController]
    public class IdentityUsersController : ControllerBase
    {
        private readonly DB_Context _context;

        public IdentityUsersController(DB_Context context)
        {
            _context = context;
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
                return new JsonResult(JsonSerialize.MessageText("You already log in."))
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

            return new JsonResult(new
            {
                token = JWT.GenerateToken(identity.Claims),
                username = identity.Name
            })
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
                return new JsonResult(JsonSerialize.MessageText("You already log in."))
                {
                    StatusCode = StatusCodes.Status200OK
                };
            }

            try
            {
                #region Trying to add a new user to the database
                var NameValid = _context.IdentityUser.Where(o => o.Email.ToLower() == authUser.Email.ToLower()).FirstOrDefault();
                if (NameValid is not null)
                    throw new Exception("Login is already taken.");

                var newIdentityUser = new AppIdentityUser
                {
                    Email = authUser.Email,
                    Password = CryptoHash.GetHashValue(authUser.Password),
                    FirstName = authUser?.FirstName,
                    LastName = authUser?.LastName
                };
                _context.IdentityUser.Add(newIdentityUser);
                await _context.SaveChangesAsync();
                #endregion

                #region Adding default TransactionCategories for new user
                _context.TransactionCategory.AddRange(new[] {
                    new TransactionCategory()
                    {
                        TransactionCategoryName = "Housing",
                        TransactionCategoryIncome = false,
                        IdentityUser = newIdentityUser
                    },
                    new TransactionCategory()
                    {
                        TransactionCategoryName = "Transport",
                        TransactionCategoryIncome = false,
                        IdentityUser = newIdentityUser
                    },
                    new TransactionCategory()
                    {
                        TransactionCategoryName = "Food",
                        TransactionCategoryIncome = false,
                        IdentityUser = newIdentityUser
                    },
                    new TransactionCategory()
                    {
                        TransactionCategoryName = "Utilities",
                        TransactionCategoryIncome = false,
                        IdentityUser = newIdentityUser
                    },
                    new TransactionCategory()
                    {
                        TransactionCategoryName = "Entertainment",
                        TransactionCategoryIncome = false,
                        IdentityUser = newIdentityUser
                    },
                    new TransactionCategory()
                    {
                        TransactionCategoryName = "Scholarship",
                        TransactionCategoryIncome = true,
                        IdentityUser = newIdentityUser
                    },
                    new TransactionCategory()
                    {
                        TransactionCategoryName = "Salary",
                        TransactionCategoryIncome = true,
                        IdentityUser = newIdentityUser
                    }
                });

                await _context.SaveChangesAsync();
                #endregion

                var identity = await GetIdentity(authUser);
                if (identity is null)
                    throw new Exception("Some error... Contact support or try again.");
                User.AddIdentity(identity);

                return new JsonResult(new
                {
                    token = JWT.GenerateToken(identity.Claims),
                    username = identity.Name
                })
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
                AppIdentityUser FoundUser = await _context.IdentityUser.FirstOrDefaultAsync(x => x.Email == loggingUser.Email);
                if (FoundUser is not null && CryptoHash.EqualHashValue(loggingUser.Password, FoundUser?.Password))
                {
                    List<Claim> claims = new()
                    {
                        new Claim(ClaimsIdentity.DefaultNameClaimType, FoundUser.Email),
                        new Claim("UserId", $"{FoundUser.UserId}"),
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
