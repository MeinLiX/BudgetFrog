﻿using WepApi.Features.TransactionDescriptionFutures.Queries;
using WepApi.Utils;

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

        RuleFor(c => c.Year)
            .NotEmpty()
            .WithMessage("Year is empty.")
            .Must(y => y >= 2000 && y <= Constants.AvaliableYear)
            .WithMessage($"Must be no earlier than 2000 and not later than {Constants.AvaliableYear}.");

        RuleFor(c => c.Month)
          .NotEmpty()
          .WithMessage("Month is empty.")
          .Must(m => m >= 1 && m <= 12)
          .WithMessage("Month must be between 1 and 12.");
    }
}
