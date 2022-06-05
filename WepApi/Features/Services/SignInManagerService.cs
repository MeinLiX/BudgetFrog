using System.Security.Claims;
using WepApi.Context.Interfaces;
using WepApi.Models.Auth;
using WepApi.Utils.Exceptions;

namespace WepApi.Features.Services;

public class SignInManagerService
{
    private readonly IBudgetAppContext _context;
    private readonly ClaimsPrincipal _user;
    public SignInManagerService(IBudgetAppContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _user = httpContextAccessor?.HttpContext?.User ?? throw new AppException("SignInManager incorrect loaded.");
    }

    public bool IsAuthenticated => _user.Identity.IsAuthenticated;//Task.FromResult();

    private void CheckNotAuthenticated()
    {
        if (IsAuthenticated)
        {
            throw new AppException("Already log in.", statusCode: System.Net.HttpStatusCode.BadRequest);
        }
    }

    private void CheckAuthenticated()
    {
        if (!IsAuthenticated)
        {
            throw new AppException("Need to log in.", statusCode: System.Net.HttpStatusCode.BadRequest);
        }
    }

    public async Task<AppIdentityUser> GetUser()
    {
        try
        {
            CheckAuthenticated();
            Guid userID = new(_user.FindFirst("UserId").Value);
            AppIdentityUser? user = await _context.AppIdentityUsers
                                                  .FirstOrDefaultAsync(u => u.ID == userID);

            if (user is null)
            {
                throw new AppException("User not found in the System.");
            }
            return user;
        }
        catch
        {
            throw;
        };
    }

    public void AddIdentity(ClaimsIdentity claimsIdentity) => _user.AddIdentity(claimsIdentity);

}
