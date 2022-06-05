using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Privat24;
using WepApi.Utils.Exceptions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.BudgetFutures.Commands
{
    public class RemoveP24credentialCommand : IRequest<Utils.Wrapper.IResult>
    {
        public string Privat24CredentialID { get; set; }
        private Guid GetPrivat24CredentialID { get => Guid.Parse(Privat24CredentialID); }
        public string BudgetID { get; set; } = "";
        private Guid GetBudgetID { get => Guid.Parse(BudgetID); }
        public class RemoveP24credentialCommandHandler : IRequestHandler<RemoveP24credentialCommand, Utils.Wrapper.IResult>
        {
            private readonly IBudgetAppContext _context;
            private readonly SignInManagerService _signInManager;
            public RemoveP24credentialCommandHandler(IBudgetAppContext context, SignInManagerService signInManager)
            {
                _context = context;
                _signInManager = signInManager;
            }
            public async Task<Utils.Wrapper.IResult> Handle(RemoveP24credentialCommand request, CancellationToken cancellationToken)
            {
                var user = await _signInManager.GetUser();
                var userBudget = await _context.Budgets.Where(b => b.ID == request.GetBudgetID && b.Users.Contains(user))
                                               .Include(b => b.Privat24Credentials)
                                               .FirstOrDefaultAsync(cancellationToken: cancellationToken)
                                               ?? throw new AppException("Budget not found");

                Privat24Credential? p24creds = userBudget.Privat24Credentials
                                                         .FirstOrDefault(p24c => p24c.ID == request.GetPrivat24CredentialID);

                if (p24creds is null)
                {
                    return Result.Fail($"Credential not found.");
                }

                _context.Privat24Credentials.Remove(p24creds);

                await _context.SaveChangesAsync();

                return Result.Success($"Credential successfully delted.");
            }
        }
    }
}
