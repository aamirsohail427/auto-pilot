using auto.services.DTO;
using auto.services.DTO.Validation;
using auto_pilot.models.Models;
using auto_pilot.services.DTO.Input;
using auto_pilot.services.DTO.Output;
using auto_pilot.services.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace auto_pilot.services.Services
{
    public class StateService: IStateService
    {
        private readonly IMapper _mapper;
        private readonly AutoPilotContext _context;
        public StateService(IMapper mapper, AutoPilotContext context)
        {
            _mapper = mapper;
            _context = context;

        }

        public async Task<List<StateOutputDTO>> GetAll()
        {
            var list = await _context.States.ToListAsync();
            return _mapper.Map<List<StateOutputDTO>>(list);
        }

        public async Task<StateOutputDTO> Create(StateInputDTO inputDTO)
        {
            var entity = _mapper.Map<State>(inputDTO);
            await _context.States.AddAsync(entity);
            await _context.SaveChangesAsync();
            return _mapper.Map<StateOutputDTO>(entity);
        }

        public async Task<ValidationResultDTO> Validate(ValidationDTO validationDTO)
        {

            var validationResultDTO = new ValidationResultDTO
            {
                IsValid = true,
                MessageCode = string.Empty,
                Data = null
            };
            var result = await _context.States.Where(x => x.Id != validationDTO.Id && x.Name == validationDTO.Title).ToListAsync();
            if (result.Count > 0)
            {
                validationResultDTO.IsValid = false;
            }
            return validationResultDTO;
        }
    }
}
