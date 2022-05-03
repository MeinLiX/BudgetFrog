using WepApi.Features.TransactionDescriptionFutures.Commands;

namespace WepApi.Features.TransactionDescriptionFutures.Validators;

public class DeleteTransactionCommandValidator : AbstractValidator<DeleteTransactionCommand>
{
    public DeleteTransactionCommandValidator()
    {
        RuleFor(c => c.BudgetID)
            .NotEmpty()
            .WithMessage("Budget id is required.")
            .Must(bID => Guid.TryParse(bID, out _))
            .WithMessage("Incorrect Budget id.");

        RuleFor(c => c.TransactionID)
            .NotEmpty()
            .WithMessage("Transaction id is required.")
            .Must(bID => Guid.TryParse(bID, out _))
            .WithMessage("Incorrect Transaction id.");
    }
}
