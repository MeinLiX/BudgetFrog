using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Transactions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.TransactionDescriptionCategoryFutures.Queries;

public class GetBudgetCategoriesQuery : IRequest<Result<List<TransactionDescriptionCategory>>>
{
    public string BudgetID { get; set; }
    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }

    public class GetBudgetCategoriesQueryHandler : IRequestHandler<GetBudgetCategoriesQuery, Result<List<TransactionDescriptionCategory>>>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public GetBudgetCategoriesQueryHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Result<List<TransactionDescriptionCategory>>> Handle(GetBudgetCategoriesQuery query, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();
            List<TransactionDescriptionCategory> categories =
                _context.TransactionDescriptionCategories
                        .Where(c => c.Budget.ID == query.GetBudgetID && c.Budget.Users.Contains(user))
                        .ToList();

            return Result<List<TransactionDescriptionCategory>>.Success(categories);
        }
    }
}
