using MediatR;
using WepApi.Context.Interfaces;
using WepApi.Models.Auth;

namespace WepApi.Features.UserFutures.Queries;

public class GetAppIdentityUserByIdQuery : IRequest<AppIdentityUser>
{
    public Guid ID { get; set; }
    public class GetAppIdentityUserByIdQueryHandler : IRequestHandler<GetAppIdentityUserByIdQuery, AppIdentityUser>
    {
        private readonly IBudgetAppContext _context;
        public GetAppIdentityUserByIdQueryHandler(IBudgetAppContext context)
        {
            _context = context;
        }
        public async Task<AppIdentityUser?> Handle(GetAppIdentityUserByIdQuery query, CancellationToken cancellationToken /*=default*/)
            => _context.AppIdentityUsers.Where(a => a.ID == query.ID).FirstOrDefault();
    }
}
