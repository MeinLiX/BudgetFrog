using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Transactions;
using WepApi.Utils.Exceptions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.TransactionDescriptionFutures.Queries;

public class GetBudgetTransactionLastDaysQuery : IRequest<Result<List<TransactionDescription>>>
{
    public string BudgetID { get; set; }
    public int Days { get; set; } = 0;
    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }

    public class GetBudgetTransactionLastDaysQueryHandler : IRequestHandler<GetBudgetTransactionLastDaysQuery, Result<List<TransactionDescription>>>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public GetBudgetTransactionLastDaysQueryHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Result<List<TransactionDescription>>> Handle(GetBudgetTransactionLastDaysQuery query, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();

            if (!(_context.Budgets.Any(b => b.ID == query.GetBudgetID && b.Users.Contains(user))))
                throw new AppException("Budget not found");

            return Result<List<TransactionDescription>>.Success(
                query.Days switch
                {
                    <= 0 => _context.TransactionsDescription
                            .Where(t => t.Budget.ID == query.GetBudgetID && t.Budget.Users.Contains(user))
                            .Include(t => t.Balance)
                            .Include(t => t.TransactionDescriptionCategory)
                            .ToList(),
                    _ => _context.TransactionsDescription
                            .Where(t => t.Budget.ID == query.GetBudgetID && t.Budget.Users.Contains(user) && t.Date.AddDays(query.Days) >= DateTime.Now)
                            .Include(t => t.Balance)
                            .Include(t => t.TransactionDescriptionCategory)
                            .ToList()
                });
        }
    }
}
