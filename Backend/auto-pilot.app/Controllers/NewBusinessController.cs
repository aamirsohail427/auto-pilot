using auto.services.DTO;
using auto.services.DTO.Validation;
using auto_pilot.services.DTO;
using auto_pilot.services.DTO.Input;
using auto_pilot.services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace auto_pilot.app.Controllers
{
    [Route("api/business")]
    [ApiController]
    public class NewBusinessController : ControllerBase
    {
        private readonly INewBusinessService _service;
        private readonly ISessionManager _session;
        public NewBusinessController(INewBusinessService service, ISessionManager session)
        {
            _service = service;
            _session = session;
        }

        #region List

        [HttpPost]
        [Route("getCustomerSummary")]
        public IActionResult GetPolicyInfo(int customerId)
        {
            return Ok(_service.GetPolicyInfo(customerId));
        }

        [HttpPost]
        [Route("getBusiness")]
        public IActionResult GetNewBusinessAsync(BusinessFilterDTO filterDTO)
        {
            return Ok(_service.GetNewBusinessAsync(filterDTO));
        }

        [HttpPost]
        [Route("getRenewal")]
        public IActionResult GetRenewalAsync(BusinessFilterDTO filterDTO)
        {
            return Ok(_service.GetRenewalAsync(filterDTO));
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> InsertPolicy(InsertPolicyInputDTO model)
        {
            return Ok(await _service.InsertPolicy(model));
        }
        #endregion


    }
}
