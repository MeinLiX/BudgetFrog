using WepApi.Features.UserFutures.Commands;

namespace WepApi.Features.UserFutures.Validators;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(r => r.Firstname)
            .NotEmpty()
            .WithMessage("Firstname is required.")
            .MaximumLength(32)
            .WithMessage("Firstname max lenght is 32.");

        RuleFor(r => r.Lastname)
            .NotEmpty()
            .WithMessage("Lastname is required.")
            .MaximumLength(32)
            .WithMessage("Lastname max lenght is 32.");

        RuleFor(r => r.Email)
            .NotEmpty()
            .WithMessage("Email address is required.")
            .EmailAddress()
            .WithMessage("Incorrect email address.");

        RuleFor(r => r.Password)
            .NotEmpty()
            .WithMessage("Password is required.")
            .Length(6, 32)
            .WithMessage("Password lenght in range from 6 to 32.");
    }
}
