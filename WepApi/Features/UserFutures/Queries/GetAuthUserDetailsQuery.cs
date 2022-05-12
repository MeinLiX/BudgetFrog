using WepApi.Features.Services;
using WepApi.Models.Auth;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.UserFutures.Queries;

public class GetAuthUserDetailsQuery : IRequest<Result<AppIdentityUser>>
{
    public Guid ID { get; set; }
    public class GetAuthUserDetailsQueryHandler : IRequestHandler<GetAuthUserDetailsQuery, Result<AppIdentityUser>>
    {
        private readonly SignInManagerService _signInManager;
        public GetAuthUserDetailsQueryHandler(SignInManagerService signInManager)
        {
            _signInManager = signInManager;
        }
        public async Task<Result<AppIdentityUser>> Handle(GetAuthUserDetailsQuery query, CancellationToken cancellationToken)
            => Result<AppIdentityUser>.Success(await _signInManager.GetUser());
    }
}
