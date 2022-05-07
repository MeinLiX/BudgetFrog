using WepApi.Features.PlannedBudgetFutures.Commands;

namespace WepApi.Features.PlannedBudgetFutures.Validators;

public class UpdatePlannedBudgetAmountCommandValidator : AbstractValidator<UpdatePlannedBudgetAmountCommand>
{
    public UpdatePlannedBudgetAmountCommandValidator()
    {
        RuleFor(pb => pb.BudgetID)
            .NotEmpty()
            .WithMessage("Budget id is required.")
            .Must(pb_bID => Guid.TryParse(pb_bID, out _))
            .WithMessage("Incorrect Budget id.");

        RuleFor(pb => pb.PlannedBudgetID)
            .NotEmpty()
            .WithMessage("Planned Budget id is required.")
            .Must(pb_pID => Guid.TryParse(pb_pID, out _))
            .WithMessage("Incorrect Planned Budget id.");

        RuleFor(pb => pb.PlannedAmount)
           .NotEmpty()
           .WithMessage("Planned amount id is required.")
           .GreaterThanOrEqualTo(0)
           .WithMessage("Planned amount cannot be negative.");
    }
}
