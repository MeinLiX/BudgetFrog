using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Text;

namespace BudgetFrogServer
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.Use(async (context, next) =>
                {
                    StringBuilder sb = new();
                    sb.Append($"Http Request Information: {Environment.NewLine}" +
                              $"Schema:{context.Request.Scheme}{Environment.NewLine}" +
                              $"Host: {context.Request.Host}{Environment.NewLine}" +
                              $"Path: {context.Request.Path}{Environment.NewLine}" +
                              $"Body: {Environment.NewLine}");
                    try
                    {
                        foreach (var item in context?.Request?.Form)
                            sb.Append($"{item.Key} : {item.Value}{ Environment.NewLine}");
                    }
                    catch
                    {
                        sb.Append($"Empty... { Environment.NewLine}");
                    }
                    logger.LogInformation(sb.ToString());

                    await next();
                });
            }

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    await context.Response.WriteAsync("Hello World!");
                });
            });
        }
    }
}
