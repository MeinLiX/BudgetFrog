using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Utils.Wrapper;
using WepApi.Models.Budgets;

namespace WepApi.Features.BudgetFutures.Commands;

public class UpdateBudgetCommand : IRequest<Utils.Wrapper.IResult>
{
    public string BudgetID { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;

    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }

    public class UpdateBudgetCommandHandler : IRequestHandler<UpdateBudgetCommand, Utils.Wrapper.IResult>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public UpdateBudgetCommandHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Utils.Wrapper.IResult> Handle(UpdateBudgetCommand request, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();
            Budget? budget = _context.Budgets
                            .Where(b => b.Users.Contains(user))
                            .Include(b => b.Users)
                            .Include(b => b.Balance)
                            .FirstOrDefault(b => b.ID == request.GetBudgetID);

            if (budget is null)
            {
                return Result.Fail($"Budget not found.");
            }
            else
            {
                budget.Name = request.Name;
                //TODO: Currency;

                await _context.SaveChangesAsync();

                return Result.Success($"Budget updated.");
            }
        }
    }

}
