using auto.services.DTO;
using auto_pilot.services.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace auto_pilot.services.Interfaces
{
    public interface IMessageService
    {
        public Task<List<MessageDTO>> GetCustomersByFilter(FilterDTO filterDTO);
        public Task<List<TemplateDTO>> GetEmailTemplatesByFilter(FilterDTO filterDTO);
        public Task<bool> SendMessageToCustomers(SendMessageDTO messageDTO);
    }
}
