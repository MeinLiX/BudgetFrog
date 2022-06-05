using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Utils.Wrapper;
using WepApi.Models.Budgets;

namespace WepApi.Features.BudgetFutures.Commands;

public class LeaveBudgetCommand : IRequest<Utils.Wrapper.IResult>
{
    public string BudgetID { get; set; }
    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }

    public class LeaveBudgetCommandHandler : IRequestHandler<LeaveBudgetCommand, Utils.Wrapper.IResult>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public LeaveBudgetCommandHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Utils.Wrapper.IResult> Handle(LeaveBudgetCommand request, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();
            Budget? budget = _context.Budgets
                            .Where(b => b.Users.Contains(user))
                            .Include(b => b.Users)
                            .FirstOrDefault(b => b.ID == request.GetBudgetID);

            if (budget is null)
            {
                return Result.Fail($"Budget not found.");
            }
            else
            {
                budget.Users.Remove(user);

                
                if (budget.Users.Count == 0)
                {
                    _context.Budgets.Remove(budget);//cascade
                }

                await _context.SaveChangesAsync();

                return Result.Success($"Left the budget");
            }
        }
    }

}
