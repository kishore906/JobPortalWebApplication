
using System.Net;
using System.Net.Mail;

namespace JobPortalWebAPI.Repositories
{
    public class EmailService : IEmailService
    {
        public IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            using var client = new SmtpClient("sandbox.smtp.mailtrap.io", 2525)
            {
                Credentials = new NetworkCredential(_config["Mailtrap:Username"],
        _config["Mailtrap:Password"]),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("no-reply@insidejobs.com"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            mailMessage.To.Add(toEmail); // in dev the email will go to mailtrap not the actual user

            await client.SendMailAsync(mailMessage);
        }
    }
}
