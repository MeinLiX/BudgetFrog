using Microsoft.IdentityModel.Tokens;

using System;
using System.Text;


namespace BudgetFrogServer.Utils
{
    public class AuthOptions
    {
        public const string ISSUER = "BudgetFrogauthService";
        public const string AUDIENCE = "BudgetFrog";
        const string KEY = "N└E♪ED °TO HI⌠DE IN F╜UTURE≥"; //TODO
        public const double LIFETIME = 30;

        public static SymmetricSecurityKey SymmetricSecurityKey => new(Encoding.ASCII.GetBytes(KEY));

        public static TokenValidationParameters TokenValidationParameters => new()
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = SymmetricSecurityKey,
            ValidateIssuer = true,
            ValidIssuer = ISSUER,
            ValidateAudience = true,
            ValidAudience = AUDIENCE,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(LIFETIME)
        };
    }

}