using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Budgets;
using WepApi.Utils.Exceptions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.PlannedBudgetFutures.Commands;

public class UpdatePlannedBudgetAmountCommand : IRequest<Utils.Wrapper.IResult>
{
    public decimal PlannedAmount { get; set; }
    public string PlannedBudgetID { get; set; }
    private Guid GetPlannedBudgetID { get => Guid.Parse(PlannedBudgetID); }
    public string BudgetID { get; set; } = "";
    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }

    public class UpdatePlannedBudgetAmountCommandHandler : IRequestHandler<UpdatePlannedBudgetAmountCommand, Utils.Wrapper.IResult>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public UpdatePlannedBudgetAmountCommandHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Utils.Wrapper.IResult> Handle(UpdatePlannedBudgetAmountCommand request, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();

            if (!(_context.Budgets.Any(b => b.ID == request.GetBudgetID && b.Users.Contains(user))))
                throw new AppException("Budget not found");

            PlannedBudget? plannedBudget =
                await _context.PlannedBudgets
                        .Where(pb => pb.Budget.ID == request.GetBudgetID &&
                                     pb.ID == request.GetPlannedBudgetID &&
                                     pb.TransactionDescriptionCategory == null)
                        .Include(pb => pb.PlannedBalance)
                        .Include(pb => pb.RealizeBalance)
                        .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            if (plannedBudget is null)
            {
                return Result.Success($"Planned Budget not found.");
            }
            else
            {
                plannedBudget.RealizeBalance.Amount = request.PlannedAmount;

                await _context.SaveChangesAsync();

                return Result.Success($"Planned Budget amount has updated.");
            }
        }
    }
}
