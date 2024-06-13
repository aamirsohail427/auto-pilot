using auto.services.DTO;
using auto.services.DTO.Validation;
using auto_pilot.services.DTO;
using auto_pilot.services.DTO.Input;
using auto_pilot.services.DTO.Output;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace auto_pilot.services.Interfaces
{
    public interface IUserTypeService
    {
        public Task<List<UserTypeOutputDTO>> GetByFilter(long Id);
        public Task<UserTypeOutputDTO> GetById(long Id);
        public Task<UserTypeOutputDTO> Create(UserTypeInputDTO inputDTO);
        public Task<UserTypeOutputDTO> Update(UserTypeInputDTO inputDTO);
        public ValidationResultDTO Check(CheckInputDTO checkInputDTO);
        public Task<DeleteInputDTO> Delete(DeleteInputDTO deleteDTO);
        public Task<List<RoleMenuDTO>> GetRoleMenus();
        public Task<List<RoleMenuDTO>> GetUserTypeMenus(int Id);
        public Task<ValidationResultDTO> Validate(ValidationDTO validationDTO);
    }
}
