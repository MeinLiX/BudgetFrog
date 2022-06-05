using WepApi.Features.PlannedBudgetFutures.Commands;

namespace WepApi.Features.PlannedBudgetFutures.Validators;

public class DeleteTransactionCommandValidator : AbstractValidator<DeletePlannedBudgetCommand>
{
    public DeleteTransactionCommandValidator()
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
    }
}
