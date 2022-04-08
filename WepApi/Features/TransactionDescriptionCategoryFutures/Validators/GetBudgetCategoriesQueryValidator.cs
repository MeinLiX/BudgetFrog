using WepApi.Features.TransactionDescriptionCategoryFutures.Queries;

namespace WepApi.Features.TransactionDescriptionCategoryFutures.Validators;

public class GetBudgetCategoriesQueryValidator : AbstractValidator<GetBudgetCategoriesQuery>
{
    public GetBudgetCategoriesQueryValidator()
    {
        RuleFor(c => c.BudgetID)
            .NotEmpty()
            .WithMessage("Budget id is required.")
            .Must(bID => Guid.TryParse(bID, out _))
            .WithMessage("Incorrect Budget id.");
    }
}
