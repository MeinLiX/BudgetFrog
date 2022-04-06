using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Utils.Wrapper;
using WepApi.Models.Budgets;

namespace WepApi.Features.BudgetFutures.Commands;

public class JoinBudgetCommand : IRequest<Utils.Wrapper.IResult>
{
    public string InviteToken { get; set; }

    public class JoinBudgetCommandHandler : IRequestHandler<JoinBudgetCommand, Utils.Wrapper.IResult>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public JoinBudgetCommandHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Utils.Wrapper.IResult> Handle(JoinBudgetCommand request, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();

            Budget? budget = _context.Budgets
                            .Where(b => b.InviteToken == request.InviteToken)
                            .Include(b => b.Users)
                            .FirstOrDefault();

            if (budget is null)
            {
                return Result.Success($"InviteToken incorrect.");
            }
            else
            {
                if (budget.Users.Contains(user))
                {
                    return Result.Success($"Already joined to budget.");
                }

                budget.Users.Add(user);

                await _context.SaveChangesAsync();

                return Result.Success($"Joined to budget.");
            }
        }
    }

}
