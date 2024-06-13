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
    public interface IMarketService
    {
        public Task<List<MarketOutputDTO>> GetByFilter(MarketFilterDTO filterDTO);
        public Task<MarketOutputDTO> GetById(long Id);
        public Task<MarketOutputDTO> Create(MarketInputDTO inputDTO);
        public Task<MarketOutputDTO> Update(MarketInputDTO inputDTO);
        public Task<DeleteInputDTO> Delete(DeleteInputDTO deleteDTO);
        public Task<ValidationResultDTO> Validate(MarketValidationDTO validationDTO);
    }
}
