using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;

namespace BudgetFrogServer.Utils
{
    public class EmailSender
    {
        private SmtpClient _smtpClient;
        private string _email;

        public EmailSender(IConfiguration configuration)
        {
            var MailConfig = configuration.GetSection("MailService");
            _email = MailConfig.GetValue<string>("Email");
            string pass = MailConfig.GetValue<string>("Password");
            string host = MailConfig.GetValue<string>("EmailHost");
            int port = MailConfig.GetValue<int>("Port");

            _smtpClient = new SmtpClient(host, port);
            _smtpClient.UseDefaultCredentials = false;
            _smtpClient.Credentials = new System.Net.NetworkCredential(_email, pass);
            _smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
            _smtpClient.EnableSsl = true;
        }

        public void SendEmail(string to, string subject, string body)
        {
            MailMessage mail = new MailMessage();

            mail.From = new MailAddress(_email);
            mail.To.Add(new MailAddress(to));
            mail.Subject = subject;
            mail.Body = body;

            _smtpClient.Send(mail);
        }
    }
}
