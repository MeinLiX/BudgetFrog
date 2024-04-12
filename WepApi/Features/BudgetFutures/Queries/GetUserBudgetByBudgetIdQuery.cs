using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Budgets;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.BudgetFutures.Queries;

public class GetUserBudgetByBudgetIdQuery : IRequest<Result<Budget?>>
{
    public string BudgetID { get; set; }
    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }
    public class GetUserBudgetByBudgetIdQueryHandler : IRequestHandler<GetUserBudgetByBudgetIdQuery, Result<Budget?>>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public GetUserBudgetByBudgetIdQueryHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Result<Budget?>> Handle(GetUserBudgetByBudgetIdQuery query, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();

            Budget? budget = _context.Budgets
                                    .Where(b => b.Users.Contains(user))
                                    .Include(b => b.Users)
                                    .Include(b => b.Balance)
                                    .Include(b=>b.BankCredentials)
                                    .FirstOrDefault(b => b.ID == query.GetBudgetID);

            if (budget == null)
            {
                return Result<Budget?>.Fail($"Budget not found.");
            }

            return Result<Budget?>.Success(budget);
        }
    }
}
