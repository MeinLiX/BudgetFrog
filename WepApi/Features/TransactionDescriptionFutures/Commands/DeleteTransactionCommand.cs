using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Budgets;
using WepApi.Models.Transactions;
using WepApi.Utils.Exceptions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.TransactionDescriptionFutures.Commands;

public class DeleteTransactionCommand : IRequest<Utils.Wrapper.IResult>
{
    public string TransactionID { get; set; }
    private Guid GetTransactionID { get => Guid.Parse(TransactionID); }
    public string BudgetID { get; set; } = "";
    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }

    public class DeleteTransactionCommandHandler : IRequestHandler<DeleteTransactionCommand, Utils.Wrapper.IResult>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        private readonly ExchangeRateService _ER_service;
        public DeleteTransactionCommandHandler(IBudgetAppContext context, SignInManagerService signInManager, ExchangeRateService ER_service)
        {
            _context = context;
            _signInManager = signInManager;
            _ER_service = ER_service;
        }
        public async Task<Utils.Wrapper.IResult> Handle(DeleteTransactionCommand request, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();

            if (!(_context.Budgets.Any(b => b.ID == request.GetBudgetID && b.Users.Contains(user))))
                throw new AppException("Budget not found");

            TransactionDescription? transaction =
                await _context.TransactionsDescription
                        .Where(c => c.Budget.ID == request.GetBudgetID && c.Budget.Users.Contains(user))
                        .Include(t => t.Balance)
                        .Include(t => t.TransactionDescriptionCategory)
                        .Include(t => t.Budget)
                        .ThenInclude(b => b.Balance)
                        .FirstOrDefaultAsync(c => c.ID == request.GetTransactionID, cancellationToken: cancellationToken);

            if (transaction is null)
            {
                return Result.Fail($"Transaction not found.");
            }
            else
            {
                var ChangeBalance = await _ER_service.ChangeCurrency(transaction.Balance, transaction.Budget.Balance.Currency, transaction.Date);
                transaction.Budget.Balance.Amount -= (transaction.TransactionDescriptionCategory.Income ? ChangeBalance.Amount : -ChangeBalance.Amount);

                PlannedBudget? plannedBudget =
                await _context.PlannedBudgets
                                .Where(pb => pb.Budget.ID == request.GetBudgetID &&
                                             pb.TransactionDescriptionCategory != null &&
                                             pb.TransactionDescriptionCategory.ID == transaction.TransactionDescriptionCategory.ID &&
                                             pb.DateStart <= transaction.Date &&
                                             pb.DateEnd >= transaction.Date)
                                .Include(pb => pb.PlannedBalance)
                                .Include(pb => pb.RealizeBalance)
                                .FirstOrDefaultAsync(cancellationToken: cancellationToken);
                if (plannedBudget is not null)
                {
                    plannedBudget.RealizeBalance.Amount -= (await _ER_service.ChangeCurrency(transaction.Balance, plannedBudget.RealizeBalance.Currency, transaction.Date)).Amount;
                }

                _context.TransactionsDescription.Remove(transaction);

                await _context.SaveChangesAsync();

                return Result.Success($"Transaction has deleted.");
            }
        }
    }
}
