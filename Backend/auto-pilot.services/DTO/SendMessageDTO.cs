using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO
{
    public class SendMessageDTO
    {
        public List<MessageDTO> SendTo { get; set; }
        public string Subject { get; set; }
        public string EmailBody { get; set; }
        public long TemplateId { get; set; }
        public long UserId { get; set; }
        public string Smtp { get; set; }
        public string Smtpassword { get; set; }
    }
}
