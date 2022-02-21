using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Utils.Wrapper;
using WepApi.Models.Budgets;

namespace WepApi.Features.BudgetFutures.Commands;

public class CreateBudgetCommand : IRequest<Utils.Wrapper.IResult>
{
    public string Name { get; set; }
    public bool Public { get; set; } = false;
    public string Currency { get; set; }

    public class CreateBudgetCommandHandler : IRequestHandler<CreateBudgetCommand, Utils.Wrapper.IResult>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public CreateBudgetCommandHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Utils.Wrapper.IResult> Handle(CreateBudgetCommand request, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();

            Budget toCreateBudget = new()
            {
                Name = request.Name,
                InviteToken = request.Public ? Guid.NewGuid().ToString("N") : "",
                Balance = new Balance()
                {
                    Amount = 0.0m,
                    Currency = request.Currency,
                }
            };

            user.Budgets.Add(toCreateBudget);
            await _context.SaveChangesAsync();

            return Result.Success($"Budget {toCreateBudget.Name} created.");
        }
    }

}
