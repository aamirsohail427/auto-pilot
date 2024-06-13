using auto.services.DTO;
using auto.services.DTO.Input;
using auto.services.DTO.Output;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace auto.services.Interfaces
{
    public interface IAuthService
    {
        public Task<UserInfoDTO> GetById(long userId);
        public Task<AuthOutputDTO> Authorization(string username);
        public Task<ValidationResultDTO> ChangePassword(ChangePasswordDTO inputDTO);
        public Task<ValidationResultDTO> ValidatePassword(ChangePasswordDTO inputDTO);
        public Task<bool> Update(long Id);
        public void UpdatePassword(long id, string password);
        public string GetLogoUrl(long Id);
        public Task<ValidationResultDTO> ValidateUsername(string email);
    }
}
