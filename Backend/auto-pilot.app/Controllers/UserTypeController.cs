using auto.services.DTO;
using auto.services.DTO.Validation;
using auto_pilot.services.DTO.Input;
using auto_pilot.services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace auto_pilot.app.Controllers
{
    [Route("api/userTypes")]
    [ApiController]
    public class UserTypeController : ControllerBase
    {
        private readonly IUserTypeService _service;
        public UserTypeController(IUserTypeService service)
        {
            _service = service;
        }

        #region List

        [HttpPost]
        [Route("getByFilter")]
        public async Task<IActionResult> GetByFilter(FilterDTO filterDTO)
        {
            return Ok(await _service.GetByFilter(filterDTO.Id));
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
        public async Task<IActionResult> Create(UserTypeInputDTO inputDTO)
        {
            return Ok(await _service.Create(inputDTO));
        }

        [HttpPost]
        [Route("update")]
        public async Task<IActionResult> Update(UserTypeInputDTO inputDTO)
        {
            return Ok(await _service.Update(inputDTO));
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

        [HttpGet]
        [Route("getRoleMenus")]
        public async Task<IActionResult> GetRoleMenus()
        {
            return Ok(await _service.GetRoleMenus());
        }

        [HttpPost]
        [Route("getUserTypeMenus")]
        public async Task<IActionResult> GetUserTypeMenus(UserTypeInputDTO inputDTO)
        {
            return Ok(await _service.GetUserTypeMenus(inputDTO.Id));
        }
        #endregion
    }
}
