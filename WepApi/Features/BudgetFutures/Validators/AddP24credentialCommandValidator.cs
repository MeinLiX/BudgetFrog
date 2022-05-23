using WepApi.Features.BudgetFutures.Commands;

namespace WepApi.Features.BudgetFutures.Validators;

public class AddP24credentialCommandValidator : AbstractValidator<AddP24credentialCommand>
{
    public AddP24credentialCommandValidator()
    {
        RuleFor(p24c => p24c.BudgetID)
            .NotEmpty()
            .WithMessage("Budget id is required.")
            .Must(pb_bID => Guid.TryParse(pb_bID, out _))
            .WithMessage("Incorrect Budget id.");

        RuleFor(p24c => p24c.MerchantID)
            .NotEmpty()
            .WithMessage("Merchant id is required.");

        RuleFor(p24c => p24c.MerchantPassword)
            .NotEmpty()
            .WithMessage("Merchant password is required.");

        RuleFor(p24c => p24c.CardNumber)
           .NotEmpty()
           .WithMessage("Card number is required.");
        
        RuleFor(p24c => p24c.StartDate);
    }
}
