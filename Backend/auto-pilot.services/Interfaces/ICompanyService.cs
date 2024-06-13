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
    public interface ICompanyService
    {
        public TilesDTO GetTiles(long Id);
        public Task<List<LookupOutputDTO>> GetByFilter(string activeState, long Id);
        public Task<LookupOutputDTO> GetById(long Id);
        public Task<LookupOutputDTO> Create(LookupInputDTO inputDTO);
        public Task<LookupOutputDTO> Update(LookupInputDTO inputDTO);
        public ValidationResultDTO Check(CheckInputDTO checkInputDTO);
        public Task<DeleteInputDTO> Delete(DeleteInputDTO deleteDTO);
        public Task<ValidationResultDTO> Validate(ValidationDTO validationDTO);
        public ResultDTO Archive(ArchiveInputDTO inputDTO);
    }
}
