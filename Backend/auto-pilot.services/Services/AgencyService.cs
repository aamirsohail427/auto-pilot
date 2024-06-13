using auto.services.DTO;
using auto.services.DTO.Input;
using auto.services.DTO.Output;
using auto.services.DTO.Validation;
using auto.services.Enums;
using auto.services.Utility;
using auto_pilot.models.Models;
using auto_pilot.services.DTO;
using auto_pilot.services.DTO.Input;
using auto_pilot.services.DTO.Output;
using auto_pilot.services.Interfaces;
using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace auto_pilot.services.Services
{
    public class AgencyService : IAgencyService
    {
        private readonly IMapper _mapper;
        private readonly AutoPilotContext _context;

        public AgencyService(IMapper mapper, AutoPilotContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        #region Tiles
        public TilesDTO GetTiles()
        {
            var companies = _context.Users.Where(flt => flt.RoleId == Convert.ToInt32(UserRole.Agency)).Select(ps => ps.IsArchived).ToList();
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
        public async Task<List<UserOutputDTO>> GetByFilter(string activeState)
        {
            List<UserOutputDTO> outputDTO = new List<UserOutputDTO>();
            outputDTO = await (from US in _context.Users.Where(flt => flt.RoleId == Convert.ToInt32(UserRole.Agency))
                               join LG in _context.Logins on US.Id equals LG.UserId

                               select new UserOutputDTO()
                               {
                                   Id = US.Id,
                                   Name = SystemUtility.DisplayFullName(US.FirstName, US.LastName),
                                   Email = US.Email,
                                   Phone = US.Phone,
                                   IsArchived = US.IsArchived,
                                   ModifiedBy = US.ModifiedById == null ? SystemUtility.DisplayFullName(US.CreatedBy.FirstName, US.CreatedBy.LastName) : SystemUtility.DisplayFullName(US.ModifiedBy.FirstName, US.ModifiedBy.LastName),
                                   ModifiedDate = US.ModifiedDate == null ? US.CreatedDate : US.ModifiedDate,
                                   LastLoginDate = LG.LastLoginDate
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
        public async Task<UserOutputDTO> GetById(long Id)
        {
            UserOutputDTO outputDTO = new UserOutputDTO();
            var entity = await (from US in _context.Users.Where(x => x.Id == Id)
                                join LG in _context.Logins on US.Id equals LG.UserId

                                select new UserOutputDTO()
                                {
                                    Id = US.Id,
                                    FirstName = SystemUtility.DisplayFullName(US.FirstName, US.LastName),
                                    Email = US.Email,
                                    Phone = US.Phone,
                                    IsArchived = US.IsArchived,
                                    IsLoginAllow = LG.IsLoginAllow,
                                    CreatedById = (long)US.CreatedById,
                                    RoleId = US.RoleId,
                                    Password = LG.Password
                                }).FirstOrDefaultAsync();
            outputDTO = _mapper.Map<UserOutputDTO>(entity);
            return outputDTO;
        }

        public async Task<UserOutputDTO> Create(UserInputDTO inputDTO)
        {
            var entity = _mapper.Map<User>(inputDTO);
            entity.Logins.Add(new Login()
            {
                UserId = entity.Id,
                Password = new PasswordHasher().HashPassword(inputDTO.Password),
                Username = inputDTO.Email,
                IsLoginAllow = inputDTO.IsLoginAllow
            });
            entity.AppSettings.Add(new AppSetting()
            {
                AgencyId = inputDTO.Id,
                CompanyName = inputDTO.FirstName,
                PrimaryEmail = inputDTO.Email,
            });
            entity.CreatedDate = DateTime.Now;
            entity.CreatedById = Convert.ToInt64(inputDTO.CreatedById);
            await _context.Users.AddAsync(entity);
            await _context.SaveChangesAsync();
            return _mapper.Map<UserOutputDTO>(entity);
        }

        public async Task<UserOutputDTO> Update(UserInputDTO inputDTO)
        {
            var userEntity = await _context.Users.FirstOrDefaultAsync(x => x.Id == inputDTO.Id);
            var loginEntity = await _context.Logins.FirstOrDefaultAsync(x => x.UserId == inputDTO.Id);


            if (loginEntity.Password != inputDTO.Password)
                loginEntity.Password = new PasswordHasher().HashPassword(inputDTO.Password);
            if (loginEntity.Username != inputDTO.Email)
                loginEntity.Username = inputDTO.Email;
            loginEntity.Username = inputDTO.Email;
            if (loginEntity.IsLoginAllow != inputDTO.IsLoginAllow)
                loginEntity.IsLoginAllow = inputDTO.IsLoginAllow;
            var mapped = _mapper.Map<UserInputDTO, User>(inputDTO, userEntity);
            mapped.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();
            return _mapper.Map<UserOutputDTO>(mapped);
        }


        public ValidationResultDTO Check(CheckInputDTO checkInputDTO)
        {
            var validationResultDTO = new ValidationResultDTO
            {
                IsValid = true
            };
            var result = _context.Users.Where(x => x.CreatedById == (long)checkInputDTO.Id || x.ModifiedById == (long)checkInputDTO.Id).ToList();
            if (result.Count > 0)
            {
                validationResultDTO.IsValid = false;
            }
            return validationResultDTO;
        }
        #endregion

    }
}
