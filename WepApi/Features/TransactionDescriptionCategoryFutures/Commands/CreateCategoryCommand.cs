using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Transactions;
using WepApi.Utils.Exceptions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.TransactionDescriptionCategoryFutures.Commands;

public class CreateCategoryCommand : IRequest<Utils.Wrapper.IResult>
{
    public string Name { get; set; }
    public bool Income { get; set; } = false;
    public string Color { get; set; }
    public string BudgetID { get; set; } = "";
    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }

    public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, Utils.Wrapper.IResult>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public CreateCategoryCommandHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Utils.Wrapper.IResult> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();

            //check unique name.
            if (_context.TransactionDescriptionCategories.Any(c =>
                                                                  c.Budget.ID == request.GetBudgetID &&
                                                                  c.Budget.Users.Contains(user) &&
                                                                  c.Name == request.Name))
            {
                return Result.Success($"Category name '{request.Name}' already taken.");
            }
            else
            {
                _context.TransactionDescriptionCategories.Add(new TransactionDescriptionCategory()
                {
                    Name = request.Name,
                    Income = request.Income,
                    Color = request.Color,
                    Budget = _context.Budgets.FirstOrDefault(b => b.ID == request.GetBudgetID && b.Users.Contains(user))
                                      ?? throw new AppException("Budget not found")
                });

                await _context.SaveChangesAsync();

                return Result.Success($"Category '{request.Name}' has created.");
            }
        }
    }
}
