using auto.services.DTO;
using auto.services.DTO.Validation;
using auto_pilot.services.DTO;
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
    [Route("api/markets")]
    [ApiController]
    public class MarketController : ControllerBase
    {
        private readonly IMarketService _service;
        private readonly IStateService _stateService;
        public MarketController(IMarketService service, IStateService stateService)
        {
            _service = service;
            _stateService = stateService;
        }

        #region List

        [HttpPost]
        [Route("getByFilter")]
        public async Task<IActionResult> GetByFilter(MarketFilterDTO filterDTO)
        {
            return Ok(await _service.GetByFilter(filterDTO));
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
        public async Task<IActionResult> Create(MarketInputDTO inputDTO)
        {
            return Ok(await _service.Create(inputDTO));
        }

        [HttpPost]
        [Route("update")]
        public async Task<IActionResult> Update(MarketInputDTO inputDTO)
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
        [Route("validate")]
        public async Task<IActionResult> Validate(MarketValidationDTO validationDTO)
        {
            return Ok(await _service.Validate(validationDTO));
        }

        [HttpGet]
        [Route("getStates")]
        public async Task<IActionResult> GetStates()
        {
            return Ok(await _stateService.GetAll());
        }

        [HttpPost]
        [Route("createState")]
        public async Task<IActionResult> Create(StateInputDTO inputDTO)
        {
            return Ok(await _stateService.Create(inputDTO));
        }

        [HttpPost]
        [Route("validateState")]
        public async Task<IActionResult> ValidateState(ValidationDTO validationDTO)
        {
            return Ok(await _stateService.Validate(validationDTO));
        }
        #endregion
    }
}
