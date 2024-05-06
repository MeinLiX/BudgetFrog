﻿using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Bank;
using WepApi.Models.Transactions;
using WepApi.Utils.Exceptions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.AssistentFutures.Queries;

public class GetAnalysisTransactionInSelectedPeriod : IRequest<Result<string>>
{
    public string BudgetID { get; set; }
    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }

    public int Month { get; set; }
    public int Year { get; set; }


    // 0 - not include
    // 1 - include banks
    // 2 - only banks
    public int IncludeBanks { get; set; } = 2;

    public class GetBudgetTransactionLastDaysQueryHandler : IRequestHandler<GetAnalysisTransactionInSelectedPeriod, Result<string>>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        private readonly MonobankApiService _monobankApiService;
        private readonly OllamaService _ollamaService;

        public GetBudgetTransactionLastDaysQueryHandler(IBudgetAppContext context, SignInManagerService signInManager, MonobankApiService monobankApiService, OllamaService ollamaService)
        {
            _context = context;
            _signInManager = signInManager;
            _monobankApiService = monobankApiService;
            _ollamaService = ollamaService;


        }

        public async Task<Result<string>> Handle(GetAnalysisTransactionInSelectedPeriod query, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();

            var userBudget = await _context.Budgets.Where(b => b.ID == query.GetBudgetID && b.Users.Contains(user))
                                                .Include(b => b.BankCredentials)
                                                .FirstOrDefaultAsync(cancellationToken: cancellationToken)
                                                ?? throw new AppException("Budget not found");
            List<TransactionDescription> transactions = [];

            if (query.IncludeBanks <= 1)
            {
                transactions = _context.TransactionsDescription
                        .Where(t => t.Budget.ID == query.GetBudgetID
                                    && t.Budget.Users.Contains(user)
                                    && t.Date.Year == query.Year
                                    && t.Date.Month == query.Month)
                        .Include(t => t.Balance)
                        .Include(t => t.TransactionDescriptionCategory)
                        .ToList();
            }

            if (query.IncludeBanks >= 1) foreach (var bankCreds in userBudget.BankCredentials)
                {
                    if (bankCreds.BankType == BankTypes.PribatBank)
                    {
                        /* //Bank temp disabled (api closed)
                        List<BankCredential> Bankcreds = userBudget.BankCredentials;
                        foreach (var Bank in Bankcreds) 
                        {
                            var res = await privat24.NET.Source.BankClient.Statement(Bankc.StartDate, DateTime.Today, Bankc.MerchantID, Bankc.MerchantPassword, Bankc.CardNumber);
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
                    }
                    if (bankCreds.BankType == BankTypes.MonoBank)
                    {
                        (await _monobankApiService.GetStatement(bankCreds.MerchantID, bankCreds.CardNumber, query.Month, query.Year)).ForEach(sp =>
                        {
                            transactions.Add(new TransactionDescription()
                            {
                                Date = DateTimeOffset.FromUnixTimeSeconds(sp.time).UtcDateTime,
                                Notes = sp.description + " " + sp.comment,
                                AutoGen = true,
                                Balance = new Models.Budgets.Balance()
                                {
                                    Amount = decimal.Parse((sp.operationAmount / 100).ToString().Replace("-", "")), //monobank default multiply X100 (decimal (0.01|25.50) -> int (1|2550))
                                    Currency = Utils.Iso4217.LookupByNumber(sp.currencyCode).Code //  Convert a currency numerical code to a 3-digit representation (980 => UAH)
                                },
                                TransactionDescriptionCategory = new TransactionDescriptionCategory()
                                {
                                    Name = "MonoBank",
                                    MMC = sp.mcc,
                                    Income = sp.operationAmount > 0,
                                    Color = "#292929"
                                }
                            });
                        });
                    }
                }


            return Result<string>.Success(data: await _ollamaService.GetAnalysisCurrentMonth(transactions));
        }

    }
}
