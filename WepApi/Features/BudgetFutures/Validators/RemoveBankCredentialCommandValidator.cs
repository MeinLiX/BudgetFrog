using WepApi.Features.BudgetFutures.Commands;

namespace WepApi.Features.BudgetFutures.Validators;

public class RemoveBankcredentialCommandValidator : AbstractValidator<RemoveBankCredentialCommand>
{
    public RemoveBankcredentialCommandValidator()
    {
        RuleFor(Bankc => Bankc.BudgetID)
            .NotEmpty()
            .WithMessage("Budget id is required.")
            .Must(pb_bID => Guid.TryParse(pb_bID, out _))
            .WithMessage("Incorrect Budget id.");

        RuleFor(pb => pb.BankCredentialID)
            .NotEmpty()
            .WithMessage("Credendial bank id is required.")
            .Must(id => Guid.TryParse(id, out _))
            .WithMessage("Incorrect credendial (bank ID).");
    }
}
