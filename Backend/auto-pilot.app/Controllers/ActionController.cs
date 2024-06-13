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
    [Route("api/actions")]
    [ApiController]
    public class ActionController : ControllerBase
    {
        private readonly IActionService _service;
        public ActionController(IActionService service)
        {
            _service = service;
        }

        [HttpPost]
        [Route("getByFilter")]
        public async Task<IActionResult> GetByFilter(ActionDTO actionDTO)
        {
            return Ok(await _service.GetByFilter(actionDTO.RouteName,actionDTO.UserId));
        }
    }
}
