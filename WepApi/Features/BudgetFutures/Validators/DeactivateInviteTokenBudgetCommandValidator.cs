using WepApi.Features.BudgetFutures.Commands;

namespace WepApi.Features.BudgetFutures.Validators;

public class DeactivateInviteTokenBudgetCommandValidator : AbstractValidator<DeactivateInviteTokenBudgetCommand>
{
    public DeactivateInviteTokenBudgetCommandValidator()
    {
        RuleFor(c => c.BudgetID)
            .NotEmpty()
            .WithMessage("Budget id is required.")
            .Must(bID => Guid.TryParse(bID, out _))
            .WithMessage("Incorrect Budget id.");
    }
}
