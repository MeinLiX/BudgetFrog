using System.Net;
using System.Security.Claims;
using WepApi.Context.Interfaces;
using WepApi.Models.Auth;
using WepApi.Utils.Exceptions;

namespace WepApi.Utils.FAuth;

public class AppIdentity
{
    internal static async Task<ClaimsIdentity> GetIdentity(AppIdentityUser loggingUser, IBudgetAppContext ctx)
    {
        if (loggingUser is null) { throw new AppException("Identity not fount. Something wrong.."); }

        AppIdentityUser FoundUser = await ctx.AppIdentityUsers.FirstAsync(x => x.Email == loggingUser.Email);
        if (FoundUser is not null && CryptoEngine.EqualHashValue(loggingUser.Password, FoundUser.Password))
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
        throw new AppException("Incorrect password", statusCode: HttpStatusCode.BadRequest);
    }


    /// <param name="loggingUser">item1: email; item2: password;</param>
    internal static async Task<ClaimsIdentity> GetIdentity((string, string) loggingUser, IBudgetAppContext ctx) => await GetIdentity(new AppIdentityUser() { Email = loggingUser.Item1, Password = loggingUser.Item2 }, ctx);
}
