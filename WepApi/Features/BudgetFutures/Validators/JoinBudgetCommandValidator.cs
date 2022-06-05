using WepApi.Features.BudgetFutures.Commands;

namespace WepApi.Features.BudgetFutures.Validators;

public class JoinBudgetCommandValidator : AbstractValidator<JoinBudgetCommand>
{
    public JoinBudgetCommandValidator()
    {
        RuleFor(c => c.InviteToken)
            .NotEmpty()
            .WithMessage("Invite token is required.");
    }
}
