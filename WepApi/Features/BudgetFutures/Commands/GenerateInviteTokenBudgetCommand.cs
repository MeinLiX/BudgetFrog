using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Utils.Wrapper;
using WepApi.Models.Budgets;

namespace WepApi.Features.BudgetFutures.Commands;

public class GenerateInviteTokenBudgetCommand : IRequest<Utils.Wrapper.IResult>
{
    public string BudgetID { get; set; }
    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }

    public class GenerateInviteTokenBudgetCommandHandler : IRequestHandler<GenerateInviteTokenBudgetCommand, Utils.Wrapper.IResult>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public GenerateInviteTokenBudgetCommandHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Utils.Wrapper.IResult> Handle(GenerateInviteTokenBudgetCommand request, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();
            Budget? budget = _context.Budgets
                            .Where(b => b.Users.Contains(user))
                            .FirstOrDefault(b => b.ID == request.GetBudgetID);

            if (budget is null)
            {
                return Result.Fail($"Budget not found.");
            }
            else
            {
                //if(budget.InviteToken != "")
                //{
                //    return Result.Success($"Invite token is already avaliable.");
                //}

                budget.InviteToken = Guid.NewGuid().ToString("N");

                await _context.SaveChangesAsync();

                return Result.Success($"New invite token is now avaliable.");
            }
        }
    }

}
