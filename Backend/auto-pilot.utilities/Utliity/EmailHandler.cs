using System;
using System.Net;

namespace auto_pilot.utilities.Utliity
{
    public static class EmailHandler
    {
        public static bool SendEmail(string subject, string message, string to, string CC, string From)
        {
            try
            {
                System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient();
                client.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
                client.EnableSsl = true;
                client.Host = "smtp.gmail.com";
                client.Port = 587;
                System.Net.NetworkCredential credentials = new System.Net.NetworkCredential("noreply@medlinkga.org", "T54bm*GjT54bm*Gj");
                client.UseDefaultCredentials = false;
                client.Credentials = credentials;
                System.Net.Mail.MailMessage mail = new System.Net.Mail.MailMessage();
                mail.From = new System.Net.Mail.MailAddress(credentials.UserName);
                mail.To.Add(new System.Net.Mail.MailAddress(to));
                if (!string.IsNullOrEmpty(CC))
                {
                    mail.CC.Add(new System.Net.Mail.MailAddress(CC));
                }

                mail.Subject = subject;
                mail.IsBodyHtml = true;
                mail.Body = message;
                client.Send(mail);
            }
            catch (Exception ex)
            {
                throw;
            }
            return true;
        }
       
    }
}
