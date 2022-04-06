using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Budgets;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.BudgetFutures.Queries;

public class GetUserBudgetsQuery : IRequest<Result<List<Budget>>>
{
    public class GetUserBudgetsQueryHandler : IRequestHandler<GetUserBudgetsQuery, Result<List<Budget>>>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public GetUserBudgetsQueryHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Result<List<Budget>>> Handle(GetUserBudgetsQuery query, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();

            List<Budget> budgetsList = _context.Budgets
                                    .Where(b => b.Users.Contains(user))
                                    .Include(b => b.Users)
                                    .Include(b => b.Balance)
                                    .ToList();

            return Result<List<Budget>>.Success(budgetsList);
        }
    }

}
