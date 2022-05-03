using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Transactions;
using WepApi.Utils.Exceptions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.TransactionDescriptionFutures.Commands;

public class CreateTransactionCommand : IRequest<Utils.Wrapper.IResult>
{
    public DateTime Date { get; set; } = DateTime.Now;
    public string? Notes { get; set; }
    public string? RecepitUrl { get; set; }
    public decimal Amount { get; set; }
    public string? Currency { get; set; }
    public string CategoryID { get; set; }
    private Guid GetCategoryID { get => Guid.Parse(CategoryID); }
    public string BudgetID { get; set; } = "";
    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }

    public class CreateTransactionCommandHandler : IRequestHandler<CreateTransactionCommand, Utils.Wrapper.IResult>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        private readonly ExchangeRateService _ER_service;
        public CreateTransactionCommandHandler(IBudgetAppContext context, SignInManagerService signInManager, ExchangeRateService ER_service)
        {
            _context = context;
            _signInManager = signInManager;
            _ER_service = ER_service;
        }
        public async Task<Utils.Wrapper.IResult> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();
            var budget = await _context.Budgets.Where(b => b.ID == request.GetBudgetID && b.Users.Contains(user))
                                         .Include(b => b.Balance)
                                         .FirstOrDefaultAsync(cancellationToken: cancellationToken) 
                                         ?? throw new AppException("Budget not found");

            var transaction = new TransactionDescription()
            {
                Date = request.Date,
                Notes = request.Notes ?? "",
                RecepitUrl = request.RecepitUrl ?? "",
                Balance = new Models.Budgets.Balance() { Amount = request.Amount, Currency = request.Currency ?? budget.Balance.Currency },
                TransactionDescriptionCategory = _context.TransactionDescriptionCategories.First(b => b.ID == request.GetCategoryID && b.Budget.Users.Contains(user))
                                                          ?? throw new AppException("Category not found"),
                Budget = budget
            };

            _context.TransactionsDescription.Add(transaction);

            var ChangeBalance = await _ER_service.ChangeCurrency(transaction.Balance, transaction.Budget.Balance.Currency);
            transaction.Budget.Balance.Amount += (transaction.TransactionDescriptionCategory.Income ? ChangeBalance.Amount : -ChangeBalance.Amount);

            await _context.SaveChangesAsync();
            return Result.Success($"Transaction has created.");
        }
    }
}
