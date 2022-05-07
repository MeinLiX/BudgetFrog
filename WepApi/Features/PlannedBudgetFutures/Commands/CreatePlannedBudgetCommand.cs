using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Budgets;
using WepApi.Utils.Exceptions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.PlannedBudgetFutures.Commands;

public class CreatePlannedBudgetCommand : IRequest<Utils.Wrapper.IResult>
{
    public DateTime DateStart { get; set; } = DateTime.Now;
    public DateTime DateEnd { get; set; } = DateTime.Now.AddMonths(1);
    public string Title { get; set; }
    public string? Desctiption { get; set; }
    public decimal PlannedAmount { get; set; }
    public string? Currency { get; set; }
    public string? CategoryID { get; set; }
    private Guid GetCategoryID { get => Guid.Parse(CategoryID); }
    public string BudgetID { get; set; } = "";
    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }

    public class CreatePlannedBudgetCommandHandler : IRequestHandler<CreatePlannedBudgetCommand, Utils.Wrapper.IResult>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        private readonly ExchangeRateService _ER_service;
        public CreatePlannedBudgetCommandHandler(IBudgetAppContext context, SignInManagerService signInManager, ExchangeRateService ER_service)
        {
            _context = context;
            _signInManager = signInManager;
            _ER_service = ER_service;
        }
        public async Task<Utils.Wrapper.IResult> Handle(CreatePlannedBudgetCommand request, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();
            var userBudget = await _context.Budgets.Where(b => b.ID == request.GetBudgetID && b.Users.Contains(user))
                                         .Include(b => b.Balance)
                                         .FirstOrDefaultAsync(cancellationToken: cancellationToken)
                                         ?? throw new AppException("Budget not found");

            if (request.DateStart > request.DateEnd.AddDays(1))
                throw new AppException("Incorrect date.");

            request.Currency ??= userBudget.Balance.Currency;
            PlannedBudget plannedBudget = new()
            {
                DateStart = request.DateStart,
                DateEnd = request.DateEnd,
                Title = request.Title,
                Desctiption = request.Desctiption,
                PlannedBalance = new Balance() { Amount = request.PlannedAmount, Currency = request.Currency },
                RealizeBalance = new Balance() { Amount = 0, Currency = request.Currency },
                TransactionDescriptionCategory = null,
                Budget = userBudget
            };

            if (!string.IsNullOrEmpty(request.CategoryID))
            {
                plannedBudget.TransactionDescriptionCategory = await _context.TransactionDescriptionCategories
                                             .FirstOrDefaultAsync(c => c.Budget.ID == userBudget.ID &&
                                                                       c.ID == request.GetCategoryID,
                                                                  cancellationToken: cancellationToken)
                                             ?? throw new AppException("Category not found.");

                var transactions = _context.TransactionsDescription
                                           .Where(t => t.Budget.ID == userBudget.ID &&
                                                       t.TransactionDescriptionCategory.ID == plannedBudget.TransactionDescriptionCategory.ID &&
                                                       t.Date > plannedBudget.DateStart &&
                                                       t.Date < plannedBudget.DateEnd)
                                           .Include(t => t.Balance)
                                           .ToList();

                transactions.ForEach(async t =>
                {
                    plannedBudget.RealizeBalance.Amount += (await _ER_service.ChangeCurrency(t.Balance, plannedBudget.RealizeBalance.Currency, t.Date)).Amount;
                });
            }

            _context.PlannedBudgets.Add(plannedBudget);
            await _context.SaveChangesAsync();
            return Result.Success($"Planned Budget has created.");
        }
    }
}