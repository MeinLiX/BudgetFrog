using WepApi.Features.TransactionDescriptionCategoryFutures.Commands;

namespace WepApi.Features.TransactionDescriptionCategoryFutures.Validators;

public class UpdateCategoryCommandValidator : AbstractValidator<UpdateCategoryCommand>
{
    public UpdateCategoryCommandValidator()
    {
        RuleFor(c => c.BudgetID)
            .NotEmpty()
            .WithMessage("Budget id is required.")
            .Must(bID => Guid.TryParse(bID, out _))
            .WithMessage("Incorrect Budget id.");

        RuleFor(c => c.CategoryID)
            .NotEmpty()
            .WithMessage("Category id is required.")
            .Must(bID => Guid.TryParse(bID, out _))
            .WithMessage("Incorrect Budget id.");

        RuleFor(c => c.Name)
            .MinimumLength(1)
            .WithMessage("The minimum length of the category name is 1")
            .MaximumLength(32)
            .WithMessage("The maximum length of the category name is 32");

        RuleFor(c => c.Income);

        RuleFor(c => c.Color)
            .Matches("^#(?:[0-9a-fA-F]{3}){1,2}$")
            .WithMessage("Invalid category color string.");
    }
}
