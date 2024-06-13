using auto.services.DTO;
using auto.services.Enums;
using auto.services.Utility;
using auto_pilot.models.Models;
using auto_pilot.services.DTO;
using auto_pilot.services.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace auto_pilot.services.Services
{
    public class MessageService : IMessageService
    {
        private readonly IMapper _mapper;
        private readonly AutoPilotContext _context;

        public MessageService(IMapper mapper, AutoPilotContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<List<MessageDTO>> GetCustomersByFilter(FilterDTO filterDTO)
        {
            List<MessageDTO> messageDTO = new List<MessageDTO>();
            var roleId = await _context.Users.Where(flt => flt.Id == filterDTO.Id).Select(s => s.RoleId).FirstOrDefaultAsync();
            if (roleId == Convert.ToInt32(UserRole.Admin))
            {
                var entity = await _context.Users.Where(flt => flt.RoleId == Convert.ToInt32(UserRole.Agency) && flt.IsArchived == false).ToListAsync();
                messageDTO = _mapper.Map<List<MessageDTO>>(entity);
            }
            else
            {
                var entity = await _context.AgencyUsers.Where(flt => flt.AgencyId == filterDTO.Id).ToListAsync();
                if (entity.Count > 0)
                {
                    List<MessageDTO> message = new List<MessageDTO>();
                    foreach (var item in entity)
                    {

                        var user = _context.Users.Where(w => w.Id == item.UserId && w.IsArchived == false).FirstOrDefault();
                        if (!(user is null))
                        {
                            var data = _mapper.Map<MessageDTO>(user);
                            message.Add(data);
                        }
                    }
                    messageDTO = message;
                }
            }
            return messageDTO;
        }

        public async Task<List<TemplateDTO>> GetEmailTemplatesByFilter(FilterDTO filterDTO)
        {
            var entity = await _context.EmailTemplates.Where(flt => flt.SourceId == filterDTO.Id && flt.IsArchived == false).ToListAsync();
            return _mapper.Map<List<TemplateDTO>>(entity);
        }

        public async Task<bool> SendMessageToCustomers(SendMessageDTO messageDTO)
        {
            bool msg = false;
            string subject = messageDTO.Subject;
            if (messageDTO.EmailBody == null)
            {
                var body = await  _context.EmailTemplates.Where(w => w.Id == messageDTO.TemplateId).Select(s => s.TemplateContent).FirstOrDefaultAsync();
                foreach (var item in messageDTO.SendTo)
                {
                    string To = item.Email;
                   msg=  SendEmail(subject, body, To, null, null, messageDTO);
                    if (msg == false)
                    {
                        return msg = false;
                    }
                }
               
            }
            else
            {
                foreach (var item in messageDTO.SendTo)
                {
                    string To = item.Email;
                    string body = string.Format(messageDTO.EmailBody);
                    msg = SendEmail(subject, body, To, null, null, messageDTO);
                    if(msg == false)
                    {
                        return msg = false;
                    }
                }
            }
            return msg;
        }
        public static bool SendEmail(string subject, string message, string to, string CC, string From, SendMessageDTO messageDTO)
        {
            try
            {
                System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient();
                client.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
                client.EnableSsl = true;
                client.Host = "smtp.gmail.com";
                client.Port = 587;
                System.Net.NetworkCredential credentials = new System.Net.NetworkCredential(messageDTO.Smtp, messageDTO.Smtpassword);
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
                return false;
            }
            return true;
        }
    }
}
