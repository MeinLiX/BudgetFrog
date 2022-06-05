using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Transactions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.TransactionDescriptionCategoryFutures.Commands;

public class UpdateCategoryCommand : IRequest<Utils.Wrapper.IResult>
{
    public string? Name { get; set; }
    public bool? Income { get; set; }
    public string? Color { get; set; }
    public string BudgetID { get; set; } = "";
    public string CategoryID { get; set; }
    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }
    private Guid GetCategoryID { get => Guid.Parse(CategoryID); }

    public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, Utils.Wrapper.IResult>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public UpdateCategoryCommandHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Utils.Wrapper.IResult> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();

            //check unique name.
            if (_context.TransactionDescriptionCategories.Any(c =>
                                                                  c.Budget.ID == request.GetBudgetID &&
                                                                  c.Budget.Users.Contains(user) &&
                                                                  c.ID != request.GetCategoryID &&
                                                                  c.Name == request.Name))
            {
                return Result.Fail($"Category name '{request.Name}' already taken.");
            }

            TransactionDescriptionCategory? category =
                await _context.TransactionDescriptionCategories
                              .FirstOrDefaultAsync(c =>
                                                       c.Budget.ID == request.GetBudgetID &&
                                                       c.Budget.Users.Contains(user) &&
                                                       c.ID == request.GetCategoryID,
                                                       cancellationToken: cancellationToken);

            if (category is null)
            {
                return Result.Fail($"Category not found.");
            }
            else
            {
                category.Name = request.Name ?? category.Name;
                category.Income = request.Income ?? category.Income;
                category.Color = request.Color ?? category.Color;

                await _context.SaveChangesAsync();

                return Result.Success($"Category '{category.Name}' has updated.");
            }
        }
    }
}
