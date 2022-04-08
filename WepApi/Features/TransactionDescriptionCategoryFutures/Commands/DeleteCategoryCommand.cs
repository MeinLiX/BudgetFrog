using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Transactions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.TransactionDescriptionCategoryFutures.Commands;

public class DeleteCategoryCommand : IRequest<Utils.Wrapper.IResult>
{
    public string BudgetID { get; set; } = "";
    public string CategoryID { get; set; }
    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }
    private Guid GetCategoryID { get => Guid.Parse(CategoryID); }

    public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, Utils.Wrapper.IResult>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public DeleteCategoryCommandHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Utils.Wrapper.IResult> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();
            TransactionDescriptionCategory? category = await _context.TransactionDescriptionCategories
                            .Where(c => c.Budget.ID == request.GetBudgetID && c.Budget.Users.Contains(user))
                            .Include(c => c.Budget)
                            .FirstOrDefaultAsync(c => c.ID == request.GetCategoryID, cancellationToken: cancellationToken);

            if (category is null)
            {
                return Result.Success($"Category not found.");
            }
            else
            {
                if (_context.TransactionsDescription.Any(t => t.TransactionDescriptionCategory.ID == category.ID))
                {
                    return Result.Success($"Category '{category.Name}' is used in some transaction.");
                }

                if (_context.PlannedBudgets.Any(t => t.TransactionDescriptionCategory.ID == category.ID))
                {
                    return Result.Success($"Category '{category.Name}' is used in some planned budget.");
                }

                _context.TransactionDescriptionCategories.Remove(category);

                await _context.SaveChangesAsync();

                return Result.Success($"Category '{category.Name}' has deleted.");
            }
        }
    }
}
