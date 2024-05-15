using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Auth;
using WepApi.Models.Response;
using WepApi.Utils;
using WepApi.Utils.Exceptions;
using WepApi.Utils.FAuth;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.UserFutures.Commands;

public class RegisterCommand : IRequest<Result<TokenResponse>>
{
    public string Firstname { get; set; }
    public string Lastname { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<TokenResponse>>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public RegisterCommandHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Result<TokenResponse>> Handle(RegisterCommand command, CancellationToken cancellationToken)
        {
            if (_signInManager.IsAuthenticated)
            {
                throw new AppException("Already log in.", statusCode: System.Net.HttpStatusCode.BadRequest);
            }

            if (_context.AppIdentityUsers.Any(u => u.Email == command.Email))
            {
                throw new AppException("Email already taken.", statusCode: System.Net.HttpStatusCode.BadRequest);
            }

            var hashSalt = CryptoEngine.PasswordHasher.HashPassword(command.Password);

            AppIdentityUser user = (await _context.AppIdentityUsers.AddAsync(new AppIdentityUser
            {
                FirstName = command.Firstname,
                LastName = command.Lastname,
                Email = command.Email,
                PasswordHash = hashSalt.Hash,
                PasswordSalt = hashSalt.Salt,
            }, cancellationToken)).Entity;

            await _context.SaveChangesAsync();

            var identity = await AppIdentity.GetIdentity((command.Email, hashSalt.Hash, hashSalt.Salt), _context);
            _signInManager.AddIdentity(identity);

            return Result<TokenResponse>.Success(new TokenResponse { token = AuthEngine.GenerateTokenJWT(identity.Claims) });
        }
    }
}

public class RegisterCommandResponse
{
    public string token { get; set; }
}
