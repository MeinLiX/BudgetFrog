using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

using BudgetFrogServer.Models.Auth;
using BudgetFrogServer.Utils;

namespace BudgetFrogServer.Controllers
{
    [Route("")]
    [ApiController]
    public class IdentityUsersController : ControllerBase
    {
        private readonly DB_IdentityContext _context;

        public IdentityUsersController(DB_IdentityContext context)
        {
            _context = context;
        }

        /// <summary>
        /// User authorization.
        /// </summary>
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> LogInUser([FromBody] IdentityUser authUser)
        {
            //IllegalActionsWithInputData(authUser);

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
        public async Task<IActionResult> LogUpUser([FromBody] IdentityUser authUser)
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
                var NameValid = _context.IdentityUser.Where(o => o.Email.ToLower() == authUser.Email.ToLower()).FirstOrDefault();
                if (NameValid is not null)
                {
                    throw new Exception("Login is already taken.");
                }

                var userToRegister = new IdentityUser
                {
                    Email = authUser.Email,
                    Password = CryptoHash.GetHashValue(authUser.Password),
                    FirstName = authUser?.FirstName,
                    LastName = authUser?.LastName
                };
                _context.IdentityUser.Add(userToRegister);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return new JsonResult(JsonSerialize.ErrorMessageText(ex.Message))
                {
                    StatusCode = StatusCodes.Status400BadRequest
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

            return new JsonResult(new
            {
                token = JWT.GenerateToken(identity.Claims),
                username = identity.Name
            })
            {
                StatusCode = StatusCodes.Status201Created
            };
        }

        /// <summary>
        /// TOTAL SECRET, SORRY!
        /// </summary>
        private static bool IllegalActionsWithInputData(IdentityUser user)
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
        private async Task<ClaimsIdentity> GetIdentity(IdentityUser myUser)
        {
            if (myUser is not null)
            {
                IdentityUser FoundUser = await _context.IdentityUser.FirstOrDefaultAsync(x => x.Email == myUser.Email);

                if (FoundUser is not null && CryptoHash.EqualHashValue(myUser.Password, FoundUser?.Password))
                {
                    List<Claim> claims = new()
                    {
                        new Claim(ClaimsIdentity.DefaultNameClaimType, FoundUser.Email)
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
