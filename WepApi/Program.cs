using System.Reflection;
using WepApi.Context;
using WepApi.Context.Interfaces;
using WepApi.Middleware;
using WepApi.PipelineBehaviours;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<BudgetAppContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("BudgetAppIdentityDB")));

builder.Services.AddScoped<IBudgetAppContext>(provider => provider.GetService<BudgetAppContext>() ?? throw new NullReferenceException());
builder.Services.AddMediatR(Assembly.GetExecutingAssembly());
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehaviour<,>));

builder.Services.AddTransient<ExceptionMiddleware>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

app.MapControllers();

app.Run();
