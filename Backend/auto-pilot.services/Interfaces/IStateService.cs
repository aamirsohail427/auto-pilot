using auto.services.DTO;
using auto.services.DTO.Validation;
using auto_pilot.services.DTO.Input;
using auto_pilot.services.DTO.Output;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace auto_pilot.services.Interfaces
{
    public interface IStateService
    {
        public Task<List<StateOutputDTO>> GetAll();
        public Task<StateOutputDTO> Create(StateInputDTO inputDTO);
        public Task<ValidationResultDTO> Validate(ValidationDTO validationDTO);
    }
}
