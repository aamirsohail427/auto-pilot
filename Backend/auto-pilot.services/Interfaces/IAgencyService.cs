using auto.services.DTO;
using auto.services.DTO.Input;
using auto.services.DTO.Output;
using auto.services.DTO.Validation;
using auto_pilot.services.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace auto_pilot.services.Interfaces
{
    public interface IAgencyService
    {
        public TilesDTO GetTiles();
        public Task<List<UserOutputDTO>> GetByFilter(string activeState);
        public Task<UserOutputDTO> GetById(long Id);
        public Task<UserOutputDTO> Create(UserInputDTO inputDTO);
        public Task<UserOutputDTO> Update(UserInputDTO inputDTO);
        public ValidationResultDTO Check(CheckInputDTO checkInputDTO);

    }
}
