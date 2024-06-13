using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;

namespace auto.services.Utility
{
    public class SystemUtility
    {
        public static string DisplayFullName(string firstName, string lastName)
        {
            if (!string.IsNullOrEmpty(firstName) || !string.IsNullOrEmpty(lastName))
            {
                if (string.IsNullOrEmpty(firstName))
                {
                    return lastName;
                }
                else if (string.IsNullOrEmpty(lastName))
                {
                    return firstName;
                }
                else
                {
                    return firstName + " " + lastName;
                }
            }
            else
            {
                return "";
            }
        }

        public static string GetTemplateMessageString(string template)
        {
            string emailTemplateBody;
            var path = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "" + template + ".txt");
            WebClient client = new WebClient();

            System.IO.Stream data = client.OpenRead(path);
            using (var sr = new StreamReader(data))
            {
                emailTemplateBody = sr.ReadToEnd();
            }

            return emailTemplateBody;
        }
        public static string GeneratePassword()
        {
            int length = 8;
            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            StringBuilder res = new StringBuilder();
            Random rnd = new Random();
            while (0 < length--)
            {
                res.Append(valid[rnd.Next(valid.Length)]);
            }
            return res.ToString();
        }
    }
}
