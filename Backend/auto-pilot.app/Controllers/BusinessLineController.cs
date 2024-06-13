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
    [Route("api/businessLines")]
    [ApiController]
    public class BusinessLineController : ControllerBase
    {
        private readonly IBusinessLineService _service;
        public BusinessLineController(IBusinessLineService service)
        {
            _service = service;
        }

        #region List

        [HttpPost]
        [Route("getTiles")]
        public IActionResult GetTiles(FilterDTO filterDTO)
        {
            return Ok(_service.GetTiles(filterDTO.Id));
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
            return Ok(await _service.GetById(Id));
        }
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create(LookupInputDTO inputDTO)
        {
            return Ok(await _service.Create(inputDTO));
        }

        [HttpPost]
        [Route("update")]
        public async Task<IActionResult> Update(LookupInputDTO inputDTO)
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

        #endregion

        #region Archive/Restore
        [HttpPost]
        [Route("archive")]
        public IActionResult Archive(ArchiveInputDTO inputDTO)
        {
            return Ok(_service.Archive(inputDTO));
        }
        #endregion
    }
}
