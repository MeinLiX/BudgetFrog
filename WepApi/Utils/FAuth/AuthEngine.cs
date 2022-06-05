using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace WepApi.Utils.FAuth;

public class AuthEngine
{
    public const string ISSUER = "BudgetFrogAuthService";
    public const string AUDIENCE = "BudgetFrog";
    const string KEY = "N└E♪ED °TO HI⌠DE IN F╜UTURE≥☆*: .｡. o(≧▽≦)o .｡.:*☆"; //TODO
    public const double LIFETIME = 120;

    public static SymmetricSecurityKey SymmetricSecurityKey => new(System.Text.Encoding.ASCII.GetBytes(KEY));

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

    public static string GenerateTokenJWT(IEnumerable<Claim> claims)
    {
        var jwt = new JwtSecurityToken(
            issuer: ISSUER,
            audience: AUDIENCE,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddMinutes(LIFETIME),
            signingCredentials: new SigningCredentials(SymmetricSecurityKey, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }
}
