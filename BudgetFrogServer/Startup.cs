using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text;

using BudgetFrogServer.Utils;
using BudgetFrogServer.Models.Auth;
using System.IO;

namespace BudgetFrogServer
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            string connectionIdentity = Configuration.GetConnectionString("IdentityConnection");
            services.AddDbContext<DB_IdentityContext>(options => options.UseSqlServer(connectionIdentity));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(jwtBearerOptions =>
            {
                jwtBearerOptions.TokenValidationParameters = AuthOptions.TokenValidationParameters;
            });

            services.AddControllers();
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
                              $"Host: {context.Request.Host}{context.Request.Path}{Environment.NewLine}" +
                              $"Body: {Environment.NewLine}");
                    try
                    {
                        using var reader = new StreamReader(
                            context.Request.Body,
                            encoding: Encoding.UTF8,
                            detectEncodingFromByteOrderMarks: false,
                            bufferSize: 1024,
                            leaveOpen: true);

                        var body = reader.ReadToEndAsync();
                        sb.Append(await body + Environment.NewLine);
                        context.Request.Body.Position = 0;
                    }
                    catch { }
                    logger.LogInformation(sb.ToString());

                    await next();
                });
            }

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
