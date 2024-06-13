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
    public class EmailTemplateService : IEmailTemplateService
    {
        private readonly IMapper _mapper;
        private readonly AutoPilotContext _context;

        public EmailTemplateService(IMapper mapper, AutoPilotContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        #region Tiles
        public TilesDTO GetTiles(long Id)
        {
            var companies = _context.EmailTemplates.Where(flt => flt.SourceId == Id).Select(ps => ps.IsArchived).ToList();
            TilesDTO companyTileDTO = new TilesDTO()
            {
                NumOfActive = companies.Count(flt => !flt),
                NumOfInactive = companies.Count(flt => flt),
                NumOfTotal = companies.Count()
            };
            return companyTileDTO;
        }
        #endregion

        #region List
        public async Task<List<EmailTemplateOutputDTO>> GetByFilter(string activeState, long Id)
        {
            List<EmailTemplateOutputDTO> outputDTO = new List<EmailTemplateOutputDTO>();
            outputDTO = await (from ET in _context.EmailTemplates.Where(flt => flt.SourceId == Id)
                               join UC in _context.Users on ET.CreatedById equals UC.Id
                               join UM in _context.Users on ET.ModifiedById equals UM.Id into MD
                               from MU in MD.DefaultIfEmpty()

                               select new EmailTemplateOutputDTO()
                               {
                                   Id = ET.Id,
                                   TemplateTitle = ET.TemplateTitle,
                                   TemplateSubject = ET.TemplateSubject,
                                   IsArchived = ET.IsArchived,
                                   ModifiedBy = ET.ModifiedById == null ? SystemUtility.DisplayFullName(UC.FirstName, UC.LastName) : SystemUtility.DisplayFullName(MU.FirstName, MU.LastName),
                                   ModifiedDate = ET.ModifiedDate == null ? ET.CreatedDate : ET.ModifiedDate
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
        public async Task<EmailTemplateOutputDTO> GetById(long Id)
        {
            EmailTemplateOutputDTO outputDTO = new EmailTemplateOutputDTO();
            var entity = await _context.EmailTemplates.Where(flt => flt.Id == Id).FirstOrDefaultAsync();
            outputDTO = _mapper.Map<EmailTemplateOutputDTO>(entity);
            return outputDTO;
        }

        public async Task<EmailTemplateOutputDTO> Create(EmailTemplateInputDTO inputDTO)
        {
            var entity = _mapper.Map<EmailTemplate>(inputDTO);
            entity.CreatedDate = DateTime.Now;
            entity.CreatedById = Convert.ToInt64(inputDTO.CreatedById);
            await _context.EmailTemplates.AddAsync(entity);
            await _context.SaveChangesAsync();
            return _mapper.Map<EmailTemplateOutputDTO>(entity);
        }

        public async Task<EmailTemplateOutputDTO> Update(EmailTemplateInputDTO inputDTO)
        {
            var entity = await _context.EmailTemplates.Where(e => e.Id == inputDTO.Id).FirstOrDefaultAsync();
            var mapped = _mapper.Map<EmailTemplateInputDTO, EmailTemplate>(inputDTO, entity);
            mapped.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();
            return _mapper.Map<EmailTemplateOutputDTO>(mapped);
        }
        #endregion

        #region Delete
        public async Task<DeleteInputDTO> Delete(DeleteInputDTO deleteDTO)
        {
            var entity = await _context.EmailTemplates.Where(x => x.Id == deleteDTO.Id).FirstOrDefaultAsync();
            _context.EmailTemplates.Remove(entity);
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
            var result = _context.EmailTemplates.Where(x => x.CreatedById == (long)checkInputDTO.Id || x.ModifiedById == (long)checkInputDTO.Id).ToList();
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
            var result = await _context.EmailTemplates.Where(x => x.Id != validationDTO.Id && x.TemplateTitle == validationDTO.Title).ToListAsync();
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
                var entity = _context.EmailTemplates.Where(flt => inputDTO.Ids.Contains(flt.Id)).ToList();
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
