﻿using Microsoft.AspNetCore.Mvc;
using WepApi.Context;
using WepApi.Features.UserFutures.Queries;
using WepApi.Models.Auth;

namespace WepApi.Controllers;

public class StatusController : BaseController
{
    private readonly BudgetAppContext _budgetAppContext;
    private IMediator _mediator;
    protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();
    public StatusController(BudgetAppContext budgetAppContext)
    {
        _budgetAppContext = budgetAppContext;
    }

    [HttpGet("ping")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Ping()
    {
       

        _budgetAppContext.AppIdentityUsers.Add(new AppIdentityUser { FirstName = "yurii", LastName = "hrohul", Password = "HASH", Email = "a@a.a"});
        await _budgetAppContext.SaveChangesAsync();
        AppIdentityUser? user = _budgetAppContext.AppIdentityUsers.FirstOrDefault(); //db trigger for test

        return new JsonResult(user)
        {
            StatusCode = StatusCodes.Status200OK
        };
    }

    [HttpGet("ping/{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        return Ok(await Mediator.Send(new GetAppIdentityUserByIdQuery { ID = id }));
    }
}