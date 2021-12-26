using WepApi.Features.UserFutures.Commands;

namespace WepApi.Features.UserFutures.Validators;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(r=>r.Email)
            .NotEmpty()
            .WithMessage("Email address is required.")
            .EmailAddress()
            .WithMessage("Incorrect email address."); 

        RuleFor(r=>r.Password)
            .NotEmpty()
            .WithMessage("Password is required.")
            .Length(6,32)
            .WithMessage("Password lenght in range from 6 to 32.");
    }
}
