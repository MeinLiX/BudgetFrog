using WepApi.Features.PlannedBudgetFutures.Commands;

namespace WepApi.Features.PlannedBudgetFutures.Validators;

public class CreateTransactionCommandValidator : AbstractValidator<CreatePlannedBudgetCommand>
{
    public CreateTransactionCommandValidator()
    {
        RuleFor(pb => pb.BudgetID)
            .NotEmpty()
            .WithMessage("Budget id is required.")
            .Must(pb_bID => Guid.TryParse(pb_bID, out _))
            .WithMessage("Incorrect Budget id.");

        RuleFor(pb => pb.CategoryID)
            .Must(pb_cID => Guid.TryParse(pb_cID, out _) || pb_cID is null)
            .WithMessage("Incorrect category id.");

        RuleFor(pb => pb.DateStart);

        RuleFor(pb => pb.DateEnd);

        RuleFor(pb => pb.Title)
            .NotEmpty()
            .WithMessage("Title is required.")
            .MaximumLength(32)
            .WithMessage("The maximum length of the notes is 32");

        RuleFor(pb => pb.Desctiption)
            .MaximumLength(64)
            .WithMessage("The maximum length of the desctiption is 64");

        RuleFor(pb => pb.PlannedAmount)
            .NotEmpty()
            .WithMessage("Planned amount id is required.")
            .GreaterThanOrEqualTo(0)
            .WithMessage("Planned amount cannot be negative.");

        RuleFor(pb => pb.Currency)
            .Matches(Utils.Constants.Currencies)
            .WithMessage("Not supported currency.");
    }
}
