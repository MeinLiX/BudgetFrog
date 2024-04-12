using WepApi.Features.BudgetFutures.Commands;

namespace WepApi.Features.BudgetFutures.Validators;

public class AddBankCredentialCommandValidator : AbstractValidator<AddBankCredentialCommand>
{
    public AddBankCredentialCommandValidator()
    {
        RuleFor(Bankc => Bankc.BudgetID)
            .NotEmpty()
            .WithMessage("Budget id is required.")
            .Must(pb_bID => Guid.TryParse(pb_bID, out _))
            .WithMessage("Incorrect Budget id.");

        RuleFor(Bankc => Bankc.MerchantID)
            .NotEmpty()
            .WithMessage("Merchant is required.");

        RuleFor(Bankc => Bankc.MerchantPassword);
            //.NotEmpty()
            //.WithMessage("Merchant password is required.");

        RuleFor(Bankc => Bankc.CardNumber);
           //.NotEmpty()
           //.WithMessage("Card number is required.");

        RuleFor(Bankc => Bankc.BankType)
            .Must(btype => btype == Models.Bank.BankTypes.PribatBank || btype == Models.Bank.BankTypes.MonoBank)
            .WithMessage("BankType must be in 0-1.");
    }
}
