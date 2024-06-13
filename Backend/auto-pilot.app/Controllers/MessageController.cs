using auto.services.DTO;
using auto_pilot.services.DTO;
using auto_pilot.services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace auto_pilot.app.Controllers
{
    [Route("api/messages")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IMessageService _service;
        public MessageController(IMessageService service)
        {
            _service = service;
        }

        [HttpPost]
        [Route("getCustomerContacts")]
        public async Task<IActionResult> GetCustomersByFilter(FilterDTO filterDTO)
        {
            return Ok(await _service.GetCustomersByFilter(filterDTO));
        }

        [HttpPost]
        [Route("getTemplates")]
        public async Task<IActionResult> GetEmailTemplatesByFilter(FilterDTO filterDTO)
        {
            return Ok(await _service.GetEmailTemplatesByFilter(filterDTO));
        }

        [HttpPost]
        [Route("sendMessage")]
        public async Task<IActionResult> SendMessageToCustomers(SendMessageDTO messageDTO)
        {
            return Ok(await _service.SendMessageToCustomers(messageDTO));
        }
    }
}
