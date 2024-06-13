using auto.services.DTO;
using auto.services.DTO.Validation;
using auto.services.Utility;
using auto_pilot.models.Models;
using auto_pilot.services.DTO;
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
    public class MarketService : IMarketService
    {
        private readonly IMapper _mapper;
        private readonly AutoPilotContext _context;

        public MarketService(IMapper mapper, AutoPilotContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        #region List
        public async Task<List<MarketOutputDTO>> GetByFilter(MarketFilterDTO filterDTO)
        {
            List<MarketOutputDTO> outputDTO = new List<MarketOutputDTO>();
            List<string> states = new List<string>();
            outputDTO = await (from AM in _context.AvailableMarkets.Where(flt => flt.AgencyId == filterDTO.Id)
                               join UC in _context.Users on AM.CreatedById equals UC.Id
                               join UM in _context.Users on AM.ModifiedById equals UM.Id into MD
                               from MU in MD.DefaultIfEmpty()
                               join AC in _context.AgencyCompanies on AM.InsuranceCompanyId equals AC.Id
                               join BT in _context.BusinessTypes on AM.BusinessTypeId equals BT.Id
                               join BL in _context.BusinessLines on AM.BusinessLineId equals BL.Id
                               select new MarketOutputDTO()
                               {
                                   Id = AM.Id,
                                   InsuranceCompany = AC.Title,
                                   Wirth = AM.Wirth,
                                   Line = BL.Title,
                                   Type = BT.Title,
                                   BusinessLineId = AM.BusinessLineId,
                                   BusinessTypeId = AM.BusinessTypeId,
                                   IsFavorite = AM.IsFavorite,
                                   AgencyId = AM.AgencyId,
                                   Notes = AM.Notes,
                                   CreatedById = AM.CreatedById,
                                   BusinessWirth = AM.Wirth == true ? "Yes" : "No",
                                   Favorite = AM.IsFavorite == true ? "Yes" : "No",
                                   ModifiedBy = AM.ModifiedById == null ? SystemUtility.DisplayFullName(UC.FirstName, UC.LastName) : SystemUtility.DisplayFullName(MU.FirstName, MU.LastName),
                                   ModifiedDate = AM.ModifiedDate == null ? AM.CreatedDate : AM.ModifiedDate,
                                   States = _context.MarketStates.Where(flt => flt.MarketId == AM.Id).Select(flt => flt.StateId).ToList(),
                                   MarketStates = String.Join(", ", (from MS in _context.MarketStates.Where(flt => flt.MarketId == AM.Id)
                                                                     join ST in _context.States on MS.StateId equals ST.Id
                                                                     select new StateOutputDTO()
                                                                     {
                                                                         Name = ST.Name
                                                                     }).Select(flt => flt.Name).ToList())

                               }).OrderByDescending(odr => odr.IsFavorite == true).ToListAsync();


            if (outputDTO.Count > 0)
            {
                if (!(filterDTO.TypeId is 0) && !(filterDTO.LineId is 0) && !(filterDTO.StateId is 0))
                {
                    outputDTO = outputDTO.Where(flt => flt.BusinessLineId == filterDTO.LineId && flt.BusinessTypeId == filterDTO.TypeId && flt.States.Contains(filterDTO.StateId)).ToList();
                }
                else if (!(filterDTO.TypeId is 0) && !(filterDTO.LineId is 0))
                {
                    outputDTO = outputDTO.Where(flt => flt.BusinessLineId == filterDTO.LineId && flt.BusinessTypeId == filterDTO.TypeId).ToList();
                }
                else if (!(filterDTO.TypeId is 0) && !(filterDTO.StateId is 0))
                {
                    outputDTO = outputDTO.Where(flt => flt.States.Contains(filterDTO.StateId) && flt.BusinessTypeId == filterDTO.TypeId).ToList();
                }
                else if (!(filterDTO.TypeId is 0) && !(filterDTO.StateId is 0))
                {
                    outputDTO = outputDTO.Where(flt => flt.States.Contains(filterDTO.StateId) && flt.BusinessLineId == filterDTO.LineId).ToList();
                }
                else if (!(filterDTO.LineId is 0))
                {
                    outputDTO = outputDTO.Where(flt => flt.BusinessLineId == filterDTO.LineId).ToList();
                }
                else if (!(filterDTO.TypeId is 0))
                {
                    outputDTO = outputDTO.Where(flt => flt.BusinessTypeId == filterDTO.TypeId).ToList();
                }
                else if (!(filterDTO.StateId is 0))
                {
                    outputDTO = outputDTO.Where(flt => flt.States.Contains(filterDTO.StateId)).ToList();
                }
            }
            return outputDTO;
        }

        #endregion

        #region Details
        public async Task<MarketOutputDTO> GetById(long Id)
        {
            var result = await _context.AvailableMarkets.Where(flt => flt.Id == Id).FirstOrDefaultAsync();
            var mapped = _mapper.Map<MarketOutputDTO>(result);
            mapped.Line = _context.BusinessLines.Where(flt => flt.Id == mapped.BusinessLineId).Select(p => p.Title).FirstOrDefault();
            mapped.Type = _context.BusinessTypes.Where(flt => flt.Id == mapped.BusinessTypeId).Select(p => p.Title).FirstOrDefault();
            mapped.Company = _context.AgencyCompanies.Where(flt => flt.Id == mapped.InsuranceCompanyId).Select(p => p.Title).FirstOrDefault();
            mapped.SelectedStates = await _context.MarketStates.Where(flt => flt.MarketId == Id).Select(flt => flt.StateId).ToListAsync();
            return mapped;
        }

        public async Task<MarketOutputDTO> Create(MarketInputDTO inputDTO)
        {
            var entity = _mapper.Map<AvailableMarket>(inputDTO);
            entity.CreatedDate = DateTime.Now;
            if (inputDTO.SelectedStates.Count > 0)
            {
                inputDTO.SelectedStates.ForEach(flt =>
                {
                    entity.MarketStates.Add(new MarketState()
                    {
                        MarketId = entity.Id,
                        StateId = flt
                    });
                });
            }
            await _context.AvailableMarkets.AddAsync(entity);
            await _context.SaveChangesAsync();
            return _mapper.Map<MarketOutputDTO>(entity);
        }

        public async Task<MarketOutputDTO> Update(MarketInputDTO inputDTO)
        {
            var entity = await _context.AvailableMarkets.FirstOrDefaultAsync(x => x.Id == inputDTO.Id);
            var stateOutput = await _context.MarketStates.Where(flt => flt.MarketId == entity.Id).ToListAsync();
            var mapped = _mapper.Map<MarketInputDTO, AvailableMarket>(inputDTO, entity);
            mapped.ModifiedDate = DateTime.Now;
            if (stateOutput.Count > 0)
                _context.RemoveRange(stateOutput);
            if (inputDTO.SelectedStates.Count > 0)
            {
                inputDTO.SelectedStates.ForEach(flt =>
                {
                    mapped.MarketStates.Add(new MarketState()
                    {
                        MarketId = entity.Id,
                        StateId = flt
                    });
                });
            }
            await _context.SaveChangesAsync();
            return _mapper.Map<MarketOutputDTO>(mapped);
        }

        #endregion

        #region Delete
        public async Task<DeleteInputDTO> Delete(DeleteInputDTO deleteDTO)
        {
            var entity = await _context.AvailableMarkets.Where(x => x.Id == deleteDTO.Id).FirstOrDefaultAsync();
            _context.AvailableMarkets.Remove(entity);
            _context.SaveChanges();
            return deleteDTO;
        }
        #endregion

        #region Validate

        public async Task<ValidationResultDTO> Validate(MarketValidationDTO validationDTO)
        {

            var validationResultDTO = new ValidationResultDTO
            {
                IsValid = true,
                MessageCode = string.Empty,
                Data = null
            };
            var result = await _context.AvailableMarkets.Where(x => x.Id != validationDTO.Id && x.InsuranceCompanyId == validationDTO.InsuranceCompanyId && x.BusinessLineId == validationDTO.BusinessLineId && x.BusinessTypeId == validationDTO.BusinessTypeId && x.AgencyId == validationDTO.AgencyId).ToListAsync();
            if (result.Count > 0)
            {
                validationResultDTO.IsValid = false;
            }
            return validationResultDTO;
        }
        #endregion
    }
}
