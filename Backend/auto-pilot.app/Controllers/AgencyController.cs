using auto.services.DTO;
using auto.services.DTO.Input;
using auto.services.DTO.Validation;
using auto.services.Interfaces;
using auto.services.Utility;
using auto_pilot.services.DTO.Input;
using auto_pilot.services.Interfaces;
using auto_pilot.utilities.Utliity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace auto_pilot.app.Controllers
{
    [Route("api/agencies")]
    [ApiController]
    public class AgencyController : ControllerBase
    {
        private readonly IAgencyService _service;
        private readonly IUserService _userService;
        public AgencyController(IAgencyService service, IUserService userService)
        {
            _service = service;
            _userService = userService;
        }


        #region List

        [HttpGet]
        [Route("getTiles")]
        public IActionResult GetTiles()
        {
            return Ok(_service.GetTiles());
        }

        [HttpPost]
        [Route("getByFilter")]
        public async Task<IActionResult> GetByFilter(FilterDTO filterDTO)
        {
            return Ok(await _service.GetByFilter(filterDTO.activeState));
        }
        #endregion

        #region Details
        [HttpGet]
        [Route("getById/{Id}")]
        public async Task<IActionResult> GetById(long Id)
        {
            return Ok(await _service.GetById(Id));
        }
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create(UserInputDTO inputDTO)
        {
            var result = await _service.Create(inputDTO);
            string subject = "Welcome to AUTOPILOT CSR";
            string To = result.Email;
            string messageString = SystemUtility.GetTemplateMessageString("welcome");
            string body = string.Format(messageString, "AUTOPILOT CSR", SystemUtility.DisplayFullName(result.FirstName, result.LastName), result.Email, inputDTO.Password);
            EmailHandler.SendEmail(subject, body, To, null, null);
            return Ok(result);
        }

        [HttpPost]
        [Route("update")]
        public async Task<IActionResult> Update(UserInputDTO inputDTO)
        {
            return Ok(await _service.Update(inputDTO));
        }
        #endregion

        #region Delete
        [HttpPost]
        [Route("delete")]
        public IActionResult Delete(DeleteInputDTO deleteDTO)
        {
            return Ok(_userService.Delete(deleteDTO));
        }
        #endregion

        #region Archive/Restore
        [HttpPost]
        [Route("archive")]
        public IActionResult Archive(ArchiveInputDTO inputDTO)
        {
            return Ok(_userService.Archive(inputDTO));
        }
        #endregion

        #region validate

        [HttpPost]
        [Route("check")]
        public IActionResult Check(CheckInputDTO checkInputDTO)
        {
            return Ok(_service.Check(checkInputDTO));
        }

        [HttpPost]
        [Route("validate")]
        public async Task<IActionResult> Validate(ValidationDTO validationDTO)
        {
            return Ok(await _userService.Validate(validationDTO));
        }

        #endregion
    }
}
