using WepApi.Features.TransactionDescriptionFutures.Queries;

namespace WepApi.Features.TransactionDescriptionFutures.Validators;

public class GetBudgetTransactionLastDaysQueryValidator : AbstractValidator<GetBudgetTransactionLastDaysQuery>
{
    public GetBudgetTransactionLastDaysQueryValidator()
    {
        RuleFor(c => c.BudgetID)
            .NotEmpty()
            .WithMessage("Budget id is required.")
            .Must(bID => Guid.TryParse(bID, out _))
            .WithMessage("Incorrect Budget id.");

        RuleFor(c => c.Days);
    }
}
