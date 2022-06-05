using WepApi.Features.TransactionDescriptionCategoryFutures.Commands;

namespace WepApi.Features.TransactionDescriptionCategoryFutures.Validators;

public class CreateCategoryCommandValidator : AbstractValidator<CreateCategoryCommand>
{
    public CreateCategoryCommandValidator()
    {
        RuleFor(c => c.BudgetID)
            .NotEmpty()
            .WithMessage("Budget id is required.")
            .Must(bID => Guid.TryParse(bID, out _))
            .WithMessage("Incorrect Budget id.");

        RuleFor(c => c.Name)
            .NotEmpty()
            .WithMessage("Name is required.")
            .MinimumLength(1)
            .WithMessage("The minimum length of the category name is 1")
            .MaximumLength(32)
            .WithMessage("The maximum length of the category name is 32");

        RuleFor(c => c.Income);

        RuleFor(c => c.Color)
            .NotEmpty()
            .WithMessage("Color is required.")
            .Matches("^#(?:[0-9a-fA-F]{3}){1,2}$")
            .WithMessage("Invalid category color string.");
    }
}
