using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Response;
using WepApi.Utils;
using WepApi.Utils.Exceptions;
using WepApi.Utils.FAuth;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.UserFutures.Commands;

public class LoginCommand : IRequest<Result<TokenResponse>>
{
    public string Email { get; set; }
    public string Password { get; set; }

    public class LoginCommandHandler : IRequestHandler<LoginCommand, Result<TokenResponse>>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public LoginCommandHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Result<TokenResponse>> Handle(LoginCommand command, CancellationToken cancellationToken)
        {
            try
            {
                if (_signInManager.IsAuthenticated)
                {
                    throw new AppException("Already log in.", statusCode: System.Net.HttpStatusCode.BadRequest);
                }

                var user = await _context.AppIdentityUsers.FirstOrDefaultAsync(u => u.Email == command.Email, cancellationToken);

                if (user is null || !CryptoEngine.EqualHashValue(command.Password, user.Password))
                {
                    throw new AppException("Email or password incorrect.", statusCode: System.Net.HttpStatusCode.BadRequest);
                }

                await _context.SaveChangesAsync();

                var identity = await AppIdentity.GetIdentity((command.Email, command.Password), _context);
                _signInManager.AddIdentity(identity);

                return Result<TokenResponse>.Success(new TokenResponse { token = AuthEngine.GenerateTokenJWT(identity.Claims) });
            }
            catch { throw; }
        }
    }
}
