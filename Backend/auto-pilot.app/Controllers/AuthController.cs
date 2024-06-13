
using auto.services.DTO;
using auto.services.DTO.Input;
using auto.services.Enums;
using auto.services.Interfaces;
using auto.services.Utility;
using auto.utilities.Utliity;
using auto_pilot.services.DTO;
using auto_pilot.services.Interfaces;
using auto_pilot.utilities.Utliity;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace auto.app.Controllers
{
    [Route("api/auths")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;
        private readonly IMenuService _menuService;
        private readonly IConfiguration _configuration;
        public AuthController(IAuthService service, IMenuService menuService, IConfiguration configuration)
        {
            _service = service;
            _menuService = menuService;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> InitSystem(AuthInputDTO inputDTO)
        {
            var result = await _service.Authorization(inputDTO.Username);
            if (!(result is null) && result.IsLoginAllow == true)
            {
                var verificationResult = new PasswordHasher().VerifyHashedPassword(result.Password, inputDTO.Password);
                if (verificationResult == PasswordVerificationResult.Success)
                {
                    var entity = await _service.GetById(result.UserId);
                    if (!(entity is null))
                    {
                        await _service.Update(result.Id);
                        entity.Menus = await _menuService.GetMenus(entity.Id);
                        if (entity.RoleId != Convert.ToInt32(UserRole.Admin))
                        {
                            if (entity.RoleId == Convert.ToInt32(UserRole.Agency))
                                entity.LogoUrl = _service.GetLogoUrl(entity.Id);

                            if (entity.RoleId == Convert.ToInt32(UserRole.User))
                                entity.LogoUrl = _service.GetLogoUrl(Convert.ToInt64(entity.CreatedById));

                        }
                        entity.AuthToken = AuthTokenHandler.GenerateAuthToken(entity, _configuration);
                        if (entity.AuthToken is null)
                        {
                            return Ok(new
                            {
                                status = 2,
                                message = "nullToken",
                                data = ""
                            });
                        }
                        return Ok(new
                        {
                            status = 1,
                            message = "success",
                            data = entity
                        });

                    }
                }

            }
            return Ok(new
            {
                status = 0,
                message = result?.IsLoginAllow == false ? "notauthorized" : "failed",
                data = ""
            });
        }

        [HttpPost]
        [Route("changePassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDTO inputDTO)
        {
            var entity = await _service.ChangePassword(inputDTO);
            return Ok(new
            {
                Data = entity
            });
        }

        [HttpPost]
        [Route("validatePassword")]
        public async Task<IActionResult> ValidatePassword(ChangePasswordDTO inputDTO)
        {
            var entity = await _service.ValidatePassword(inputDTO);
            return Ok(new
            {
                Data = entity
            });
        }

        [HttpPost]
        [Route("validateUsername")]
        public async Task<IActionResult> validateUsername(ValidateUserDTO validateUserDTO)
        {
            var entity = await _service.ValidateUsername(validateUserDTO.Email);
            return Ok(new
            {
                Data = entity
            });
        }

        [HttpPost]
        [Route("resetPassword")]
        public async Task<IActionResult> UpdatePassword(UpdatePasswordDTO passwordDTO)
        {
            string password = SystemUtility.GeneratePassword();
            _service.UpdatePassword(passwordDTO.Id, password);
            var entity = await _service.GetById(passwordDTO.Id);
            if (!(entity is null))
            {
                string subject = "Password Reset";
                string To = passwordDTO.Email;
                string messageString = SystemUtility.GetTemplateMessageString("forgotPassword");
                string body = string.Format(messageString, SystemUtility.DisplayFullName(entity.FirstName, entity.LastName), password);
                EmailHandler.SendEmail(subject, body, To, null, null);
            }
            return Ok();
        }
    }
}
