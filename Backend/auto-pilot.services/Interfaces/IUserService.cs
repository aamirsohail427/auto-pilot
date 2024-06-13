using auto.services.DTO;
using auto.services.DTO.Input;
using auto.services.DTO.Output;
using auto.services.DTO.Validation;
using auto_pilot.services.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace auto.services.Interfaces
{
    public interface IUserService
    {
        public TilesDTO GetTiles(long Id);
        public Task<UserOutputDTO> GetById(long Id);
        public Task<UserOutputDTO> GetDetailById(long Id);
        public Task<UserOutputDTO> GetCompanyById(long Id);
        public Task<List<UserOutputDTO>> GetByFilter(string activeState, long Id);
        public Task<UserOutputDTO> Create(UserInputDTO inputDTO);
        public Task<UserOutputDTO> Update(UserInputDTO inputDTO);
        public Task<bool> UpdateUserProfile(UserInputDTO inputDTO);
        public Task<DeleteInputDTO> Delete(DeleteInputDTO deleteDTO);
        public ValidationResultDTO Check(CheckInputDTO checkInputDTO);
        public Task<ValidationResultDTO> Validate(ValidationDTO validationDTO);
        public ResultDTO Archive(ArchiveInputDTO inputDTO);
    }
}
