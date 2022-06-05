using WepApi.Features.TransactionDescriptionFutures.Commands;

namespace WepApi.Features.TransactionDescriptionFutures.Validators;

public class UpdateTransactionCommandValidator : AbstractValidator<UpdateTransactionCommand>
{
    public UpdateTransactionCommandValidator()
    {
        RuleFor(c => c.BudgetID)
            .NotEmpty()
            .WithMessage("Budget id is required.")
            .Must(bID => Guid.TryParse(bID, out _))
            .WithMessage("Incorrect Budget id.");

        RuleFor(c => c.CategoryID)
            .NotEmpty()
            .WithMessage("Category id is required.")
            .Must(bID => Guid.TryParse(bID, out _))
            .WithMessage("Incorrect Budget id."); 
    }
}
