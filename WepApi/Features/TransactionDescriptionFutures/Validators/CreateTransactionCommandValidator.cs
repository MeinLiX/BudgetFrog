using WepApi.Features.TransactionDescriptionFutures.Commands;

namespace WepApi.Features.TransactionDescriptionFutures.Validators;

public class CreateTransactionCommandValidator : AbstractValidator<CreateTransactionCommand>
{
    public CreateTransactionCommandValidator()
    {
        RuleFor(ctc => ctc.BudgetID)
            .NotEmpty()
            .WithMessage("Budget id is required.")
            .Must(bID => Guid.TryParse(bID, out _))
            .WithMessage("Incorrect Budget id.");

        RuleFor(ctc => ctc.CategoryID)
            .NotEmpty()
            .WithMessage("Category id is required.")
            .Must(bID => Guid.TryParse(bID, out _))
            .WithMessage("Incorrect category id.");

        RuleFor(ctc => ctc.Date);

        RuleFor(ctc => ctc.Notes)
            .MaximumLength(64)
            .WithMessage("The maximum length of the notes is 64");

        RuleFor(ctc => ctc.Amount)
            .NotEmpty()
            .WithMessage("Amount id is required.")
            .GreaterThanOrEqualTo(0)
            .WithMessage("Amount cannot be negative.");

        RuleFor(ctc => ctc.Currency)
            .Matches(Utils.Constants.Currencies)
            .WithMessage("Not supported currency.");
    }
}
