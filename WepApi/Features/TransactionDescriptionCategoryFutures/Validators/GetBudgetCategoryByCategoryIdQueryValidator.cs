using WepApi.Features.TransactionDescriptionCategoryFutures.Queries;

namespace WepApi.Features.TransactionDescriptionCategoryFutures.Validators;

public class GetBudgetCategoryByCategoryIdQueryValidator : AbstractValidator<GetBudgetCategoryByCategoryIdQuery>
{
    public GetBudgetCategoryByCategoryIdQueryValidator()
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
            .WithMessage("Incorrect category id.");
    }
}
