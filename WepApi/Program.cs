using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using System.Reflection;
using WepApi.Context;
using WepApi.Context.Interfaces;
using WepApi.Features.HostedService;
using WepApi.Features.Services;
using WepApi.Middleware;
using WepApi.PipelineBehaviours;
using WepApi.Utils;
using WepApi.Utils.FAuth;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddLogging();
builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory =
            actionContext => new BadRequestObjectResult(new ApiBehavior().ErrorFormatResponseValidation(actionContext.ModelState));
    }); //temp

builder.Services.AddHttpContextAccessor();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                   .AddJwtBearer(jwtBearerOptions =>
                                 jwtBearerOptions.TokenValidationParameters = AuthEngine.TokenValidationParameters);

builder.Services.AddDbContext<BudgetAppContext>(options =>
                options.UseNpgsql(builder.Configuration["ConnectionStrings:BudgetAppIdentityDB"]));
builder.Services.AddScoped<IBudgetAppContext>(provider =>
                provider.GetService<BudgetAppContext>() ?? throw new NullReferenceException());

builder.Services.AddDbContext<ExchangeRateContext>(options =>
                options.UseNpgsql(builder.Configuration["ConnectionStrings:FastForexDB"]));
builder.Services.AddScoped<IExchangeRateContext>(provider =>
                provider.GetService<ExchangeRateContext>() ?? throw new NullReferenceException());

builder.Services.AddScoped<SignInManagerService>();
builder.Services.AddScoped<ExchangeRateService>();

builder.Services.AddHostedService<ExchangeRatesFFUpdaterHostedService>();


builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<Program>());
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehaviour<,>));

builder.Services.AddTransient<ExceptionMiddleware>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c=>
{
    c.SwaggerDoc("v1",
            new OpenApiInfo
            {
                Title = "BudgetFrog api",
                Version = "v1",
                Description = ""
            }
         );
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "JWT Authentication",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = @$"JWT Authorization header using the Bearer scheme. {Environment.NewLine}Enter 'bearer' [space] and then your token in the text input below.",

        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement{{ jwtSecurityScheme, Array.Empty<string>() }});

    c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, "BudgetFrogApi.xml"));
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
app.UseSwagger();

app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();
app.UseRouting();

app.UseCors(x => x
            .AllowAnyMethod()
            .AllowAnyHeader()
            //.AllowAnyOrigin()
            .SetIsOriginAllowed(origin => true)
            .AllowCredentials());

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseSwaggerUI();
app.Run();
