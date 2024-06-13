using auto.services.DTO;
using auto.services.DTO.Input;
using auto.services.DTO.Validation;
using auto.services.Interfaces;
using auto.services.Utility;
using auto_pilot.services.DTO;
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
    [Route("api/appSettings")]
    [ApiController]
    public class AppSettingController : ControllerBase
    {
        private readonly IAppSettingService _service;
        public AppSettingController(IAppSettingService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("getById/{Id}")]
        public async Task<IActionResult> GetById(long Id)
        {
            return Ok(await _service.GetById(Id));
        }

        [HttpPost]
        [Route("update")]
        public async Task<IActionResult> Update(AppSettingDTO inputDTO)
        {
            return Ok(await _service.UpdateSettings(inputDTO));
        }

        [HttpPost]
        [Route("uploadLogo")]
        public async Task<IActionResult> UploadLogo(IFormFile files)
        {
            List<BlobUploadFileResponse> UploadedFiles = new List<BlobUploadFileResponse>();
            BlobUploadFileResponse directory = await AzureBlobHandler.Upload(files);
            UploadedFiles.Add(directory);
            return Ok(UploadedFiles);
        }
    }
}
