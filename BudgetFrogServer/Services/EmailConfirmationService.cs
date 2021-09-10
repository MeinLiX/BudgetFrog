using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BudgetFrogServer.Models;
using BudgetFrogServer.Models.Auth;
using BudgetFrogServer.Utils;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace BudgetFrogServer.Services
{
    public class EmailConfirmationService
    {
        private static readonly Random _randomGenerator = new Random();

        private readonly DB_Context _base_context;

        private readonly EmailSender _emailSender;

        private readonly IConfiguration _configuration;

        private readonly ILogger<EmailConfirmationService> _logger;

        public EmailConfirmationService(DB_Context base_context, IConfiguration configuration, ILogger<EmailConfirmationService> logger)
        {
            _base_context = base_context;
            _emailSender = new EmailSender(configuration);
            _configuration = configuration;
            _logger = logger;
        }

        public string AddConfiramtion(AppIdentityUser user)
        {
            string randomKey = RandomString(64);
            var sdf = _base_context.EmailConfirmationKey;
            var keyEmail = sdf.FirstOrDefault(u => u.Email == user.Email);
        
            if (keyEmail != null)
            {
                keyEmail.Key = randomKey;
            }
            else
            {
                _base_context.EmailConfirmationKey.Add(new EmailConfirmationKey
                {
                    Key = randomKey,
                    Email = user.Email,
                });
            }
            _base_context.SaveChanges();
            Task.Run(() => SendEmail(randomKey, user));
            return randomKey;
        }

        public bool Confirm(string key)
        {
            var keyEmail = _base_context.EmailConfirmationKey.FirstOrDefault(u => u.Key == key);
            if (keyEmail != null)
            {
                _base_context.AppIdentityUser.FirstOrDefault(u => u.Email == keyEmail.Email).IsConfirmed = true;
                _base_context.EmailConfirmationKey.Remove(keyEmail);
                _base_context.SaveChangesAsync();

                return true;
            }
            else
            {
                return false;
            }
        }

        public string RandomString(int length)
        {
            while (true)
            {
                const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                string res = new string(Enumerable.Repeat(chars, length)
                  .Select(s => s[_randomGenerator.Next(s.Length)]).ToArray());
                if (_base_context.EmailConfirmationKey.FirstOrDefault(e => e.Key == res) == null)
                {
                    return res;
                }
            }
        }

        private void SendEmail(string key, AppIdentityUser user)
        {
            try
            {
                string body = $"Dear {user.FirstName} {user.LastName}, please confirm your registrationa by visiting" +
                    $" localhost:5000/confirm?key={key}";
                _emailSender.SendEmail(user.Email, "BudgetFrogRegistration", body);
            }
            catch (Exception e)
            {
                //_logger.LogError(e.Message);
            }
        }
    }
}
