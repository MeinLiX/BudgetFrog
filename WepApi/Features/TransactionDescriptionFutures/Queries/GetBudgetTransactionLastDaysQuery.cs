using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Privat24;
using WepApi.Models.Transactions;
using WepApi.Utils.Exceptions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.TransactionDescriptionFutures.Queries;

public class GetBudgetTransactionLastDaysQuery : IRequest<Result<List<TransactionDescription>>>
{
    public string BudgetID { get; set; }
    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }

    public int Month { get; set; }
    public int Year { get; set; }

    public class GetBudgetTransactionLastDaysQueryHandler : IRequestHandler<GetBudgetTransactionLastDaysQuery, Result<List<TransactionDescription>>>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        private readonly MonobankApiService _monobankApiService;

        public GetBudgetTransactionLastDaysQueryHandler(IBudgetAppContext context, SignInManagerService signInManager, MonobankApiService monobankApiService)
        {
            _context = context;
            _signInManager = signInManager;
            _monobankApiService = monobankApiService;
        }
        public async Task<Result<List<TransactionDescription>>> Handle(GetBudgetTransactionLastDaysQuery query, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();

            var userBudget = await _context.Budgets.Where(b => b.ID == query.GetBudgetID && b.Users.Contains(user))
                                                .Include(b => b.Privat24Credentials)
                                                .FirstOrDefaultAsync(cancellationToken: cancellationToken)
                                                ?? throw new AppException("Budget not found");


            List<TransactionDescription> transactions = _context.TransactionsDescription
                        .Where(t => t.Budget.ID == query.GetBudgetID 
                                    && t.Budget.Users.Contains(user) 
                                    && t.Date.Year == query.Year 
                                    && t.Date.Month == query.Month)
                        .Include(t => t.Balance)
                        .Include(t => t.TransactionDescriptionCategory)
                        .ToList();

            //TODO DB
            /*(await _monobankApiService.GetStatement(string.Empty)).ForEach(sp =>
            {
                transactions.Add(new TransactionDescription()
                {
                    Date = DateTimeOffset.FromUnixTimeSeconds(sp.time).UtcDateTime,
                    Notes = sp.description + sp.comment,
                    AutoGen = true,
                    Balance = new Models.Budgets.Balance()
                    {
                        Amount = decimal.Parse((sp.operationAmount / 100).ToString().Replace("-","")),
                        Currency = sp.currencyCode.ToString()
                    },
                    TransactionDescriptionCategory = new TransactionDescriptionCategory()
                    {
                        Name = "MonoBank",
                        Income = sp.operationAmount > 0,
                        Color = "#292929"
                    }
                });
            });
            */
            /* //p24 temp disabled (api closed)
            List<Privat24Credential> p24creds = userBudget.Privat24Credentials;
            foreach (var p24c in p24creds) 
            {
                var res = await privat24.NET.Source.P24Client.Statement(p24c.StartDate, DateTime.Today, p24c.MerchantID, p24c.MerchantPassword, p24c.CardNumber);
                res.Data.Info.Statements.StatementsProp.ForEach(sp =>
                {
                    transactions.Add(new TransactionDescription()
                    {
                        Date = DateTime.Parse(sp.Trandate+"T"+ sp.Trantime),
                        Notes = sp.Description,
                        AutoGen = true,
                        Balance = new Models.Budgets.Balance()
                        {
                            Amount = decimal.Parse(sp.Amount.Split(" ")[0]),
                            Currency = sp.Amount.Split(" ")[1].ToUpper()
                        },
                        TransactionDescriptionCategory = new TransactionDescriptionCategory()
                        {
                            Name = "Privat24",
                            Income = !sp.Cardamount.StartsWith("-"),
                            Color = "#228B22"
                        }
                    });
                });
            };*/


            return Result<List<TransactionDescription>>.Success(transactions.OrderByDescending(t => t.Date).ToList());
        }
    }
}
