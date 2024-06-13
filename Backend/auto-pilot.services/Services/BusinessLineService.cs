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
    public class BusinessLineService : IBusinessLineService
    {
        private readonly IMapper _mapper;
        private readonly AutoPilotContext _context;

        public BusinessLineService(IMapper mapper, AutoPilotContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        #region Tiles
        public TilesDTO GetTiles(long Id)
        {
            var businessLines = _context.BusinessLines.Where(flt => flt.AgencyId == Id).Select(ps => ps.IsArchived).ToList();
            TilesDTO companyTileDTO = new TilesDTO()
            {
                NumOfActive = businessLines.Count(flt => !flt),
                NumOfInactive = businessLines.Count(flt => flt),
                NumOfTotal = businessLines.Count()
            };
            return companyTileDTO;
        }
        #endregion

        #region List
        public async Task<List<LookupOutputDTO>> GetByFilter(string activeState, long Id)
        {
            List<LookupOutputDTO> outputDTO = new List<LookupOutputDTO>();
            outputDTO = await (from BL in _context.BusinessLines.Where(flt => flt.AgencyId == Id)
                               join UC in _context.Users on BL.CreatedById equals UC.Id
                               join UM in _context.Users on BL.ModifiedById equals UM.Id into MD
                               from MU in MD.DefaultIfEmpty()

                               select new LookupOutputDTO()
                               {
                                   Id = BL.Id,
                                   Title = BL.Title,
                                   IsArchived = BL.IsArchived,
                                   ModifiedBy = BL.ModifiedById == null ? SystemUtility.DisplayFullName(UC.FirstName, UC.LastName) : SystemUtility.DisplayFullName(MU.FirstName, MU.LastName),
                                   ModifiedDate = BL.ModifiedDate == null ? BL.CreatedDate : BL.ModifiedDate
                               }).ToListAsync();

            if (outputDTO.Count > 0)
            {
                switch (activeState)
                {
                    case "Active":
                        outputDTO = outputDTO.Where(flt => flt.IsArchived == false).ToList();
                        break;
                    case "Archived":
                        outputDTO = outputDTO.Where(flt => flt.IsArchived == true).ToList();
                        break;
                    default:
                        break;
                }
            }

            return outputDTO;
        }
        #endregion

        #region Details
        public async Task<LookupOutputDTO> GetById(long Id)
        {
            var result = await _context.BusinessLines.Where(flt => flt.Id == Id).FirstOrDefaultAsync();
            return _mapper.Map<LookupOutputDTO>(result); ;
        }

        public async Task<LookupOutputDTO> Create(LookupInputDTO inputDTO)
        {
            var entity = _mapper.Map<BusinessLine>(inputDTO);
            entity.CreatedDate = DateTime.Now;
            await _context.BusinessLines.AddAsync(entity);
            await _context.SaveChangesAsync();
            return _mapper.Map<LookupOutputDTO>(entity);
        }

        public async Task<LookupOutputDTO> Update(LookupInputDTO inputDTO)
        {
            var entity = await _context.BusinessLines.FirstOrDefaultAsync(x => x.Id == inputDTO.Id);
            var mapped = _mapper.Map<LookupInputDTO, BusinessLine>(inputDTO, entity);
            mapped.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();
            return _mapper.Map<LookupOutputDTO>(mapped);
        }


        #endregion

        #region Delete
        public async Task<DeleteInputDTO> Delete(DeleteInputDTO deleteDTO)
        {
            var entity = await _context.BusinessLines.Where(x => x.Id == deleteDTO.Id).FirstOrDefaultAsync();
            _context.BusinessLines.Remove(entity);
            _context.SaveChanges();
            return deleteDTO;
        }
        #endregion

        #region Validate
        public ValidationResultDTO Check(CheckInputDTO checkInputDTO)
        {
            var validationResultDTO = new ValidationResultDTO
            {
                IsValid = true
            };
            var result = _context.AvailableMarkets.Where(x => x.BusinessLineId == (long)checkInputDTO.Id).ToList();
            if (result.Count > 0)
            {
                validationResultDTO.IsValid = false;
            }
            return validationResultDTO;
        }
        public async Task<ValidationResultDTO> Validate(ValidationDTO validationDTO)
        {

            var validationResultDTO = new ValidationResultDTO
            {
                IsValid = true,
                MessageCode = string.Empty,
                Data = null
            };
            var result = await _context.BusinessLines.Where(x => x.Id != validationDTO.Id && x.Title == validationDTO.Title && x.AgencyId == validationDTO.AgencyId).ToListAsync();
            if (result.Count > 0)
            {
                validationResultDTO.IsValid = false;
            }
            return validationResultDTO;
        }
        #endregion

        #region Archive/Restore
        public ResultDTO Archive(ArchiveInputDTO inputDTO)
        {
            var resultDTO = new ResultDTO
            {
                IsValid = true,
            };
            if (inputDTO.Ids.Count > 0)
            {
                var entity = _context.BusinessLines.Where(flt => inputDTO.Ids.Contains(flt.Id)).ToList();
                entity.ForEach(flt =>
                {
                    flt.IsArchived = !flt.IsArchived;
                    _context.SaveChanges();
                });
            }

            return resultDTO;
        }
        #endregion
    }
}
