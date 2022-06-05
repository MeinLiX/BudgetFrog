using WepApi.Features.BudgetFutures.Commands;

namespace WepApi.Features.BudgetFutures.Validators;

public class RemoveP24credentialCommandValidator : AbstractValidator<RemoveP24credentialCommand>
{
    public RemoveP24credentialCommandValidator()
    {
        RuleFor(p24c => p24c.BudgetID)
            .NotEmpty()
            .WithMessage("Budget id is required.")
            .Must(pb_bID => Guid.TryParse(pb_bID, out _))
            .WithMessage("Incorrect Budget id.");

        RuleFor(pb => pb.Privat24CredentialID)
            .NotEmpty()
            .WithMessage("Privat24 credendial id is required.")
            .Must(pb_pID => Guid.TryParse(pb_pID, out _))
            .WithMessage("Incorrect Privat24 credendial id.");
    }
}
