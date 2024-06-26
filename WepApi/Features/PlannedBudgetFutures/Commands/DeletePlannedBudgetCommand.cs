﻿using WepApi.Context.Interfaces;
using WepApi.Features.Services;
using WepApi.Models.Budgets;
using WepApi.Utils.Exceptions;
using WepApi.Utils.Wrapper;

namespace WepApi.Features.PlannedBudgetFutures.Commands;

public class DeletePlannedBudgetCommand : IRequest<Utils.Wrapper.IResult>
{
    public string PlannedBudgetID { get; set; }
    private Guid GetPlannedBudgetID { get => Guid.Parse(PlannedBudgetID); }
    public string BudgetID { get; set; } = "";
    private Guid GetBudgetID { get => Guid.Parse(BudgetID); }

    public class DeletePlannedBudgetCommandHandler : IRequestHandler<DeletePlannedBudgetCommand, Utils.Wrapper.IResult>
    {
        private readonly IBudgetAppContext _context;
        private readonly SignInManagerService _signInManager;
        public DeletePlannedBudgetCommandHandler(IBudgetAppContext context, SignInManagerService signInManager)
        {
            _context = context;
            _signInManager = signInManager;
        }
        public async Task<Utils.Wrapper.IResult> Handle(DeletePlannedBudgetCommand request, CancellationToken cancellationToken)
        {
            var user = await _signInManager.GetUser();

            if (!(_context.Budgets.Any(b => b.ID == request.GetBudgetID && b.Users.Contains(user))))
                throw new AppException("Budget not found");

            PlannedBudget? plannedBudget =
                await _context.PlannedBudgets
                        .FirstOrDefaultAsync(pb => pb.Budget.ID == request.GetBudgetID && pb.ID == request.GetPlannedBudgetID,
                                             cancellationToken: cancellationToken);

            if (plannedBudget is null)
            {
                return Result.Fail($"Planned Budget not found.");
            }
            else
            {
                _context.PlannedBudgets.Remove(plannedBudget);

                await _context.SaveChangesAsync();

                return Result.Success($"Planned Budget has deleted.");
            }
        }
    }
}
