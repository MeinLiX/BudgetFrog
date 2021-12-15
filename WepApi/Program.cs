using Microsoft.EntityFrameworkCore;
using WepApi.Context;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<BudgetAppContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("BudgetAppIdentityDB")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

app.MapControllers();

app.Run();
