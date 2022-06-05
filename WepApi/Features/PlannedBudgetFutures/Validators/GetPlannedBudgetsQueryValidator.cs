using WepApi.Features.PlannedBudgetFutures.Queries;

namespace WepApi.Features.PlannedBudgetFutures.Validators;

public class GetPlannedBudgetsQueryValidator : AbstractValidator<GetPlannedBudgetsQuery>
{
    public GetPlannedBudgetsQueryValidator()
    {
        RuleFor(pb => pb.BudgetID)
            .NotEmpty()
            .WithMessage("Budget id is required.")
            .Must(pb_bID => Guid.TryParse(pb_bID, out _))
            .WithMessage("Incorrect Budget id.");
    }
}
