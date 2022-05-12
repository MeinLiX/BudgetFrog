using WepApi.Features.Services;
using WepApi.Models.Auth;

namespace WepApi.Features.UserFutures.Queries;

public class GetAuthUserDetailsQuery : IRequest<AppIdentityUser>
{
    public Guid ID { get; set; }
    public class GetAuthUserDetailsQueryHandler : IRequestHandler<GetAuthUserDetailsQuery, AppIdentityUser>
    {
        private readonly SignInManagerService _signInManager;
        public GetAuthUserDetailsQueryHandler(SignInManagerService signInManager)
        {
            _signInManager = signInManager;
        }
        public async Task<AppIdentityUser> Handle(GetAuthUserDetailsQuery query, CancellationToken cancellationToken)
            => await _signInManager.GetUser();
    }
}
