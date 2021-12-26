using System.Security.Claims;
using WepApi.Context.Interfaces;
using WepApi.Models.Auth;
using WepApi.Utils;
using WepApi.Utils.Exceptions;
using WepApi.Utils.FAuth;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.UserFutures.Commands;

public class RegisterCommand : IRequest<Result<RegisterCommandResponse>>
{
    public string Email { get; set; }
    public string Password { get; set; }
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<RegisterCommandResponse>>
    {
        private readonly IBudgetAppContext _context;
        private readonly ClaimsPrincipal _user;
        public RegisterCommandHandler(IBudgetAppContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _user = httpContextAccessor.HttpContext.User;
        }
        public async Task<Result<RegisterCommandResponse>> Handle(RegisterCommand command, CancellationToken cancellationToken)
        {
            if (_user.Identity.IsAuthenticated)
            {
                throw new AppException("Already log in.", statusCode: System.Net.HttpStatusCode.BadRequest);
            }

            if (_context.AppIdentityUsers.Any(u => u.Email == command.Email))
            {
                throw new AppException("Email already taken.", statusCode: System.Net.HttpStatusCode.BadRequest);
            }

            AppIdentityUser user = (await _context.AppIdentityUsers.AddAsync(new AppIdentityUser
            {
                FirstName = "",
                LastName = "",
                Email = command.Email,
                Password = CryptoEngine.GetHashValue(command.Password) //temp for test
            }, cancellationToken)).Entity;

            await _context.SaveChangesAsync();

            var identity = await AppIdentity.GetIdentity((command.Email, command.Password), _context);
            _user.AddIdentity(identity);

            return Result<RegisterCommandResponse>.Success(new RegisterCommandResponse { token = AuthEngine.GenerateTokenJWT(identity.Claims) });
        }
    }
}

public class RegisterCommandResponse
{
    public string token { get; set; }
}
