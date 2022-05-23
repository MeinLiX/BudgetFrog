using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Privat24;
using WepApi.Utils.Exceptions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.BudgetFutures.Commands
{
    public class AddP24credentialCommand : IRequest<Utils.Wrapper.IResult>
    {
        public string MerchantID { get; set; }
        public string MerchantPassword { get; set; }
        public string CardNumber { get; set; }
        public DateTime StartDate { get; set; } = DateTime.Now;
        public string BudgetID { get; set; } = "";
        private Guid GetBudgetID { get => Guid.Parse(BudgetID); }
        public class AddP24credentialCommandHandler : IRequestHandler<AddP24credentialCommand, Utils.Wrapper.IResult>
        {
            private readonly IBudgetAppContext _context;
            private readonly SignInManagerService _signInManager;
            public AddP24credentialCommandHandler(IBudgetAppContext context, SignInManagerService signInManager)
            {
                _context = context;
                _signInManager = signInManager;
            }
            public async Task<Utils.Wrapper.IResult> Handle(AddP24credentialCommand request, CancellationToken cancellationToken)
            {
                var user = await _signInManager.GetUser();
                var userBudget = await _context.Budgets.Where(b => b.ID == request.GetBudgetID && b.Users.Contains(user))
                                             .Include(b => b.Privat24Credentials)
                                             .FirstOrDefaultAsync(cancellationToken: cancellationToken)
                                             ?? throw new AppException("Budget not found");

                if (userBudget.Privat24Credentials.Any(p24c => p24c.CardNumber == request.CardNumber))
                {
                    return Result.Fail($"CardNumber already connected.");
                }

                Privat24Credential p24creds = new()
                {
                    MerchantID = request.MerchantID,
                    MerchantPassword = request.MerchantPassword,
                    CardNumber = request.CardNumber,
                    StartDate = request.StartDate
                };

                try
                {
                    await privat24.NET.Source.P24Client.Balance(p24creds.MerchantID, p24creds.MerchantPassword, p24creds.CardNumber); //trow when incorrect creds

                    userBudget.Privat24Credentials.Add(p24creds);

                    await _context.SaveChangesAsync();

                    return Result.Success($"Privat24 successfully connected.");
                }
                catch
                {
                    return Result.Fail($"Incorrect credential.");
                }
            }
        }
    }
}
