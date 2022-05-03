using WepApi.Features.TransactionDescriptionFutures.Commands;

namespace WepApi.Features.TransactionDescriptionFutures.Validators;

public class CreateTransactionCommandValidator : AbstractValidator<CreateTransactionCommand>
{
    public CreateTransactionCommandValidator()
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
            .WithMessage("Incorrect category id.");

        RuleFor(c => c.Date);

        RuleFor(c => c.Notes)
            .MaximumLength(64)
            .WithMessage("The maximum length of the notes is 64");

        RuleFor(c => c.RecepitUrl);

        RuleFor(r => r.Amount)
            .NotEmpty()
            .WithMessage("Amount id is required.")
            .GreaterThanOrEqualTo(0)
            .WithMessage("Amount cannot be negative.");

        RuleFor(r => r.Currency)
            .Matches(Utils.Constants.Currencies)
            .WithMessage("Not supported currency.");
    }
}
