using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Text;

using BudgetFrogServer.Utils;
using BudgetFrogServer.Models;

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
            services.AddCors();

            string connectionIdentity = Configuration.GetConnectionString("IdentityConnection");
            services.AddDbContext<DB_Context>(options => options.UseSqlServer(connectionIdentity));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(jwtBearerOptions =>
            {
                jwtBearerOptions.TokenValidationParameters = AuthOptions.TokenValidationParameters;
            });

            services.AddControllers();
            services.AddSwaggerGen();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
        {
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseDeveloperExceptionPage();
                app.Use(async (context, next) =>
                {
                    StringBuilder sb = new();
                    sb.Append($"Time: {DateTime.Now:G}{Environment.NewLine}" +
                              $"URI: {context.Request.Host}{context.Request.Path}{Environment.NewLine}" +
                              $"Body: {Environment.NewLine}");

                    var bodyContext = "";
                    context.Request.EnableBuffering();
                    using (StreamReader reader = new(context.Request.Body,
                                                     encoding: Encoding.UTF8,
                                                     detectEncodingFromByteOrderMarks: false,
                                                     bufferSize: 1024,
                                                     leaveOpen: true))
                    {
                        bodyContext = await reader.ReadToEndAsync();
                        sb.Append(bodyContext + Environment.NewLine);
                    }
                    context.Request.Body.Position = 0;
                    logger.LogInformation(sb.ToString());
                    await next();
                });
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                });
            }

            app.UseRouting();

            app.UseCors(x => x
               .AllowAnyMethod()
               .AllowAnyHeader()
               .SetIsOriginAllowed(origin => true)
               .AllowCredentials());

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
