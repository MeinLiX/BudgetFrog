using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Utils.Wrapper;
using WepApi.Models.Budgets;
using WepApi.Models.Transactions;

namespace WepApi.Features.BudgetFutures.Commands;

public class CreateBudgetCommand : IRequest<Utils.Wrapper.IResult>
{
    public string Name { get; set; }
    public bool InviteToken { get; set; } = false;
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
                InviteToken = request.InviteToken ? Guid.NewGuid().ToString("N") : "",
                Balance = new Balance()
                {
                    Amount = 0.0m,
                    Currency = request.Currency,
                }
            };

            user.Budgets.Add(toCreateBudget);

            await _context.SaveChangesAsync();

            #region Adding default TransactionCategories for new budget
            // TODO: Make json config for default transaction category
            _context.TransactionDescriptionCategories.AddRange(new[] {
                    new TransactionDescriptionCategory()
                    {
                        Name = "Housing",
                        Income = false,
                        Color = "#9ef293",
                        Budget = toCreateBudget
                    },
                    new TransactionDescriptionCategory()
                    {
                        Name = "Transport",
                        Income = false,
                        Color = "#93eaed",
                        Budget = toCreateBudget
                    },
                    new TransactionDescriptionCategory()
                    {
                        Name = "Food",
                        Income = false,
                        Color = "#db3d47",
                        Budget = toCreateBudget
                    },
                    new TransactionDescriptionCategory()
                    {
                        Name = "Utilities",
                        Income = false,
                        Color = "#eaa7ef",
                        Budget = toCreateBudget
                    },
                    new TransactionDescriptionCategory()
                    {
                        Name = "Entertainment",
                        Income = false,
                        Color = "#ff33a0",
                        Budget = toCreateBudget
                    },
                    new TransactionDescriptionCategory()
                    {
                        Name = "Scholarship",
                        Income = true,
                        Color = "#5533ff",
                        Budget = toCreateBudget
                    },
                    new TransactionDescriptionCategory()
                    {
                        Name = "Salary",
                        Income = true,
                        Color = "#004cff",
                        Budget = toCreateBudget
                    }
                });

            await _context.SaveChangesAsync();
            #endregion

            return Result.Success($"Budget {toCreateBudget.Name} created.");
        }
    }
}
