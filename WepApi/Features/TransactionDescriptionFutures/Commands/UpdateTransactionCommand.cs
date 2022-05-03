using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Transactions;
using WepApi.Utils.Exceptions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.TransactionDescriptionFutures.Commands;

public class UpdateTransactionCommand : IRequest<Utils.Wrapper.IResult>
{
    public DateTime Date { get; set; } = DateTime.Now;
    public string? Notes { get; set; }
    public string? RecepitUrl { get; set; }
    public decimal Amount { get; set; }
    public string? Currency { get; set; }
    public string? CategoryID { get; set; }
    private Guid GetCategoryID { get => Guid.Parse(CategoryID); }
    public string BudgetID { get; set; } = "";
    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }
    public string TransactionID { get; set; }
    private Guid GetTransactionID { get => Guid.Parse(TransactionID); }

    public class UpdateTransactionCommandHandler : IRequestHandler<UpdateTransactionCommand, Utils.Wrapper.IResult>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public UpdateTransactionCommandHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Utils.Wrapper.IResult> Handle(UpdateTransactionCommand request, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();

            if (!(_context.Budgets.Any(b => b.ID == request.GetBudgetID && b.Users.Contains(user))))
                throw new AppException("Budget not found");

            var transaction =
                await _context.TransactionsDescription
                              .FirstOrDefaultAsync(c =>
                                                       c.Budget.ID == request.GetBudgetID &&
                                                       c.Budget.Users.Contains(user) &&
                                                       c.ID == request.GetTransactionID,
                                                       cancellationToken: cancellationToken);

            if (transaction is null)
            {
                return Result.Success($"Transaction not found.");
            }
            else
            {
               //TODO: IN FUTURE.

                return Result.Success($"Transaction has updated.");
            }
        }
    }
}
