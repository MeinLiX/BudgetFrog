using WepApi.Features.BudgetFutures.Commands;

namespace WepApi.Features.BudgetFutures.Validators;

public class UpdateBudgetCommandValidator : AbstractValidator<UpdateBudgetCommand>
{
    public UpdateBudgetCommandValidator()
    {
        RuleFor(c => c.BudgetID)
            .NotEmpty()
            .WithMessage("Budget id is required.")
            .Must(bID => Guid.TryParse(bID, out _))
            .WithMessage("Incorrect Budget id.");

        RuleFor(r => r.Name)
            .MaximumLength(32)
            .WithMessage("Budget name must be less than 32 characters.");

        RuleFor(r => r.Currency)
            .Matches(Utils.Constants.Currencies)
            .WithMessage("Not supported currency.");
    }
}
