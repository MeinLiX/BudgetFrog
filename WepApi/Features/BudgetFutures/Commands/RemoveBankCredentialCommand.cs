using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Bank;
using WepApi.Utils.Exceptions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.BudgetFutures.Commands
{
    public class RemoveBankCredentialCommand : IRequest<Utils.Wrapper.IResult>
    {
        public string BankCredentialID { get; set; }
        private Guid GetBankCredentialID { get => Guid.Parse(BankCredentialID); }
        public string BudgetID { get; set; } = "";
        private Guid GetBudgetID { get => Guid.Parse(BudgetID); }
        public class RemoveBankcredentialCommandHandler : IRequestHandler<RemoveBankCredentialCommand, Utils.Wrapper.IResult>
        {
            private readonly IBudgetAppContext _context;
            private readonly SignInManagerService _signInManager;
            public RemoveBankcredentialCommandHandler(IBudgetAppContext context, SignInManagerService signInManager)
            {
                _context = context;
                _signInManager = signInManager;
            }
            public async Task<Utils.Wrapper.IResult> Handle(RemoveBankCredentialCommand request, CancellationToken cancellationToken)
            {
                var user = await _signInManager.GetUser();

                var userBudget = await _context.Budgets.Where(b => b.ID == request.GetBudgetID && b.Users.Contains(user))
                                               .Include(b => b.BankCredentials)
                                               .FirstOrDefaultAsync(cancellationToken: cancellationToken)
                                               ?? throw new AppException("Budget not found");

                BankCredential? Bankcreds = userBudget.BankCredentials
                                                         .FirstOrDefault(Bank => Bank.ID == request.GetBankCredentialID);

                if (Bankcreds is null)
                {
                    return Result.Fail($"Bank credential not found.");
                }

                _context.BankCredentials.Remove(Bankcreds);

                await _context.SaveChangesAsync();

                return Result.Success($"Bank credential successfully delted.");
            }
        }
    }
}
