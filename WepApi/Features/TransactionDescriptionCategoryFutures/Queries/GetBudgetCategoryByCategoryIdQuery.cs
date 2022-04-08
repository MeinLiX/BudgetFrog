using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Transactions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.TransactionDescriptionCategoryFutures.Queries;

public class GetBudgetCategoryByCategoryIdQuery : IRequest<Result<TransactionDescriptionCategory?>>
{
    public string BudgetID { get; set; } = "";
    public string CategoryID { get; set; }
    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }
    private Guid GetCategoryID { get => Guid.Parse(CategoryID); }

    public class GetBudgetCategoryByCategoryIdQueryHandler : IRequestHandler<GetBudgetCategoryByCategoryIdQuery, Result<TransactionDescriptionCategory?>>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public GetBudgetCategoryByCategoryIdQueryHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Result<TransactionDescriptionCategory?>> Handle(GetBudgetCategoryByCategoryIdQuery query, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();
            TransactionDescriptionCategory? category =
                _context.TransactionDescriptionCategories
                        .FirstOrDefault(c =>
                                            c.Budget.ID == query.GetBudgetID &&
                                            c.Budget.Users.Contains(user) &&
                                            c.ID == query.GetCategoryID);

            if (category is null)
            {
                return Result<TransactionDescriptionCategory?>.Success(category, $"Category not found.");
            }

            return Result<TransactionDescriptionCategory?>.Success(category);
        }
    }
}
