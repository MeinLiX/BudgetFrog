using WepApi.Features.BudgetFutures.Commands;

namespace WepApi.Features.BudgetFutures.Validators;

public class CreateBudgetCommandValidator : AbstractValidator<CreateBudgetCommand>
{
    public CreateBudgetCommandValidator()
    {
        RuleFor(r => r.Name)
            .NotEmpty()
            .WithMessage("Budget name is required.")
            .MaximumLength(32)
            .WithMessage("Budget name must be less than 32 characters.");

        RuleFor(r => r.Currency)
            .NotEmpty()
            .WithMessage("Currency is required.")
            .Matches(Utils.Constants.Currencies)
            .WithMessage("Not supported currency.");
    }
}
