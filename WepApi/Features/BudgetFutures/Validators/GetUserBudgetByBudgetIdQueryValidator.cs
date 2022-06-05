using WepApi.Features.BudgetFutures.Queries;

namespace WepApi.Features.BudgetFutures.Validators;

public class GetUserBudgetByBudgetIdQueryValidator : AbstractValidator<GetUserBudgetByBudgetIdQuery>
{
    public GetUserBudgetByBudgetIdQueryValidator()
    {
        RuleFor(c => c.BudgetID)
            .NotEmpty()
            .WithMessage("Budget id is required.")
            .Must(bID => Guid.TryParse(bID, out _))
            .WithMessage("Incorrect Budget id.");
    }
}
