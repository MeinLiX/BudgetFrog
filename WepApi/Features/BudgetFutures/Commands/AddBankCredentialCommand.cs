using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Bank;
using WepApi.Utils.Exceptions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.BudgetFutures.Commands
{
    public class AddBankCredentialCommand : IRequest<Utils.Wrapper.IResult>
    {
        public string MerchantID { get; set; }
        public string MerchantPassword { get; set; }
        public string CardNumber { get; set; }
        public string BudgetID { get; set; } = "";
        public BankTypes BankType { get; set; } = 0;
        private Guid GetBudgetID { get => Guid.Parse(BudgetID); }
        public class AddBankcredentialCommandHandler : IRequestHandler<AddBankCredentialCommand, Utils.Wrapper.IResult>
        {
            private readonly IBudgetAppContext _context;
            private readonly SignInManagerService _signInManager;
            private readonly MonobankApiService _monobankApiService;
            public AddBankcredentialCommandHandler(IBudgetAppContext context, SignInManagerService signInManager, MonobankApiService monobankApiService)
            {
                _context = context;
                _signInManager = signInManager;
                _monobankApiService = monobankApiService;
            }
            public async Task<Utils.Wrapper.IResult> Handle(AddBankCredentialCommand request, CancellationToken cancellationToken)
            {
                var user = await _signInManager.GetUser();

                if (request.BankType == BankTypes.PribatBank)
                    return Result.Fail($"privat24 temporarily disabled.");

                var userBudget = await _context.Budgets.Where(b => b.ID == request.GetBudgetID && b.Users.Contains(user))
                                             .Include(b => b.BankCredentials)
                                             .FirstOrDefaultAsync(cancellationToken: cancellationToken)
                                             ?? throw new AppException("Budget not found");

                if (userBudget.BankCredentials.Any(Bank => Bank.MerchantID == request.MerchantID && Bank.BankType == request.BankType))
                {
                    return Result.Fail($"CardNumber already connected.");
                }

                BankCredential bankCreds = new()
                {
                    MerchantID = request.MerchantID,
                    MerchantPassword = request.MerchantPassword,
                    CardNumber = request.CardNumber,
                    BankType = request.BankType,
                };

                try
                {
                    switch (bankCreds.BankType)
                    {
                        case BankTypes.PribatBank:
                            await privat24.NET.Source.BankClient.Balance(bankCreds.MerchantID, bankCreds.MerchantPassword, bankCreds.CardNumber); //trow when incorrect creds

                            userBudget.BankCredentials.Add(bankCreds);

                            await _context.SaveChangesAsync();

                            return Result.Success($"Privat24 successfully connected.");
                        case BankTypes.MonoBank:
                            var res = await _monobankApiService.GetClientInfo(bankCreds.MerchantID);
                            if (res is null || string.IsNullOrEmpty(res.clientId)) //validate creds;
                                throw new AppException();

                            userBudget.BankCredentials.Add(bankCreds);

                            await _context.SaveChangesAsync();
                            return Result.Success($"Monobank successfully connected.");
                        default: throw new AppException();
                    }
                }
                catch
                {
                    return Result.Fail($"Incorrect credential.");
                }
            }
        }
    }
}
