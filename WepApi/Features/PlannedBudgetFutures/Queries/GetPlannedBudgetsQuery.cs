using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Budgets;
using WepApi.Utils.Exceptions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.PlannedBudgetFutures.Queries;

public class GetPlannedBudgetsQuery : IRequest<Result<List<PlannedBudget>>>
{
    public string BudgetID { get; set; }
    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }

    public class GetPlannedBudgetsQueryHandler : IRequestHandler<GetPlannedBudgetsQuery, Result<List<PlannedBudget>>>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public GetPlannedBudgetsQueryHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Result<List<PlannedBudget>>> Handle(GetPlannedBudgetsQuery query, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();

            if (!(_context.Budgets.Any(b => b.ID == query.GetBudgetID && b.Users.Contains(user))))
                throw new AppException("Budget not found");

            return Result<List<PlannedBudget>>.Success(
                _context.PlannedBudgets.Where(pb => pb.Budget.ID == query.GetBudgetID)
                                       .Include(pb => pb.PlannedBalance)
                                       .Include(pb => pb.RealizeBalance)
                                       .Include(pb => pb.TransactionDescriptionCategory)
                                       .ToList()
                );
        }
    }
}
