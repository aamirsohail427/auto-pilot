using auto.services.DTO;
using auto.services.DTO.Input;
using auto.services.DTO.Validation;
using auto.services.Interfaces;
using auto.services.Utility;
using auto_pilot.utilities.Utliity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace edu.app.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;
        public UserController(IUserService service)
        {
            _service = service;
        }


        #region List

        [HttpGet]
        [Route("getTiles/{Id}")]
        public IActionResult GetTiles(long Id)
        {
            return Ok(_service.GetTiles(Id));
        }

        [HttpPost]
        [Route("getByFilter")]
        public async Task<IActionResult> GetByFilter(FilterDTO filterDTO)
        {
            return Ok(await _service.GetByFilter(filterDTO.activeState, filterDTO.Id));
        }
        #endregion

        #region Details
        [HttpGet]
        [Route("getById/{Id}")]
        public async Task<IActionResult> GetById(long Id)
        {
            return Ok(await _service.GetDetailById(Id));
        }
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create(UserInputDTO inputDTO)
        {
            var result = await _service.Create(inputDTO);
            //var entity = await _service.GetCompanyById(result.CreatedById);
            //string subject = "Welcome to " + entity.FirstName + "";
            //string To = result.Email;
            //string messageString = SystemUtility.GetTemplateMessageString("welcome");
            //string body = string.Format(messageString, "" + entity.FirstName + "", SystemUtility.DisplayFullName(result.FirstName, result.LastName), result.Email, inputDTO.Password);
            //EmailHandler.SendEmail(subject, body, To, null, null);
            return Ok(result);
        }

        [HttpPost]
        [Route("update")]
        public async Task<IActionResult> Update(UserInputDTO inputDTO)
        {
            return Ok(await _service.Update(inputDTO));
        }

        [HttpPost]
        [Route("updateProfile")]
        public async Task<IActionResult> UpdateProfile(UserInputDTO inputDTO)
        {
            return Ok(await _service.UpdateUserProfile(inputDTO));
        }
        #endregion

        #region Delete
        [HttpPost]
        [Route("delete")]
        public IActionResult Delete(DeleteInputDTO deleteDTO)
        {
            return Ok(_service.Delete(deleteDTO));
        }
        #endregion

        #region Archive/Restore
        [HttpPost]
        [Route("archive")]
        public IActionResult Archive(ArchiveInputDTO inputDTO)
        {
            return Ok(_service.Archive(inputDTO));
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
            return Ok(await _service.Validate(validationDTO));
        }

        #endregion
    }
}
