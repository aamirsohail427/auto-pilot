using AutoMapper;
using auto.services.DTO;
using auto.services.DTO.Input;
using auto.services.DTO.Output;
using auto.services.Interfaces;
using Microsoft.AspNet.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using auto_pilot.models.Models;
using auto.services.DTO.Validation;
using auto_pilot.services.DTO;
using auto.services.Enums;
using auto.services.Utility;

namespace auto.services.Services
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly AutoPilotContext _context;

        public UserService(IMapper mapper, AutoPilotContext context)
        {
            _mapper = mapper;
            _context = context;
        }



        #region Tiles
        public TilesDTO GetTiles(long Id)
        {
            var users = (from CU in _context.AgencyUsers.Where(flt => flt.AgencyId == Id)
                         join US in _context.Users on CU.UserId equals US.Id
                         select new UserOutputDTO()
                         {
                             IsArchived = US.IsArchived
                         }).ToList();
            TilesDTO companyTileDTO = new TilesDTO()
            {
                NumOfActive = users.Count(flt => !flt.IsArchived),
                NumOfInactive = users.Count(flt => flt.IsArchived),
                NumOfTotal = users.Count()
            };
            return companyTileDTO;
        }
        #endregion

        #region List
        public async Task<List<UserOutputDTO>> GetByFilter(string activeState, long Id)
        {
            List<UserOutputDTO> outputDTO = new List<UserOutputDTO>();
            outputDTO = await (from CU in _context.AgencyUsers.Where(flt => flt.AgencyId == Id)
                               join US in _context.Users on CU.UserId equals US.Id
                               join UT in _context.UserTypes on CU.UserTypeId equals UT.Id
                               join LG in _context.Logins on US.Id equals LG.UserId

                               select new UserOutputDTO()
                               {
                                   Id = US.Id,
                                   FirstName = US.FirstName,
                                   LastName = US.LastName,
                                   Email = US.Email,
                                   Phone = US.Phone,
                                   UserType = UT.Title,
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
            var data = await _context.Users.Where(x => x.Id == Id).FirstOrDefaultAsync();
            outputDTO = _mapper.Map<UserOutputDTO>(data);
            return outputDTO;
        }


        public async Task<UserOutputDTO> GetCompanyById(long Id)
        {
            UserOutputDTO outputDTO = new UserOutputDTO();
            var data = await _context.Users.Where(x => x.Id == Id).FirstOrDefaultAsync();
            outputDTO = _mapper.Map<UserOutputDTO>(data);
            return outputDTO;
        }


        public async Task<UserOutputDTO> GetDetailById(long Id)
        {
            UserOutputDTO outputDTO = new UserOutputDTO();
            var entity = await (from US in _context.Users.Where(x => x.Id == Id)
                                join AU in _context.AgencyUsers on US.Id equals AU.UserId
                                join LG in _context.Logins on US.Id equals LG.UserId
                                join UT in _context.UserTypes on AU.UserTypeId equals UT.Id

                                select new UserOutputDTO()
                                {
                                    Id = US.Id,
                                    FirstName = US.FirstName,
                                    LastName = US.LastName,
                                    Email = US.Email,
                                    Phone = US.Phone,
                                    RoleId = US.RoleId,
                                    UserType = UT.Title,
                                    UserTypeId = AU.UserTypeId,
                                    IsLoginAllow = LG.IsLoginAllow,
                                    IsArchived = US.IsArchived,
                                    Password = LG.Password,
                                    CreatedById = (long)US.CreatedById
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
                Username = inputDTO.Email,
                Password = new PasswordHasher().HashPassword(inputDTO.Password.Trim()),
                IsLoginAllow = inputDTO.IsLoginAllow
            });

            entity.AgencyUserUsers.Add(new AgencyUser()
            {
                UserId = entity.Id,
                AgencyId = inputDTO.CreatedById,
                UserTypeId = inputDTO.UserTypeId
            });
            entity.CreatedDate = DateTime.Now;
            entity.CreatedById = inputDTO.CreatedById;
            await _context.Users.AddAsync(entity);
            await _context.SaveChangesAsync();
            return _mapper.Map<UserOutputDTO>(entity);
        }

        public async Task<UserOutputDTO> Update(UserInputDTO inputDTO)
        {
            var userEntity = await _context.Users.FirstOrDefaultAsync(x => x.Id == inputDTO.Id);
            var loginEntity = await _context.Logins.FirstOrDefaultAsync(x => x.UserId == inputDTO.Id);
            var companyEntity = await _context.AgencyUsers.FirstOrDefaultAsync(x => x.UserId == inputDTO.Id);
            var mapped = _mapper.Map<UserInputDTO, User>(inputDTO, userEntity);
            if (inputDTO.Password != loginEntity.Password)
                loginEntity.Password = new PasswordHasher().HashPassword(inputDTO.Password.Trim());
            if (loginEntity.Username != inputDTO.Email)
                loginEntity.Username = inputDTO.Email;
            if (loginEntity.IsLoginAllow != inputDTO.IsLoginAllow)
                loginEntity.IsLoginAllow = inputDTO.IsLoginAllow;
            if (companyEntity.UserTypeId != inputDTO.UserTypeId)
                companyEntity.UserTypeId = inputDTO.UserTypeId;
            mapped.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();
            return _mapper.Map<UserOutputDTO>(mapped);
        }


        public async Task<bool> UpdateUserProfile(UserInputDTO inputDTO)
        {
            var entity = await _context.Users.FirstOrDefaultAsync(x => x.Id == inputDTO.Id);
            var mapped = _mapper.Map<User, UserInputDTO>(entity, inputDTO);
            await _context.SaveChangesAsync();
            return true;
        }
        #endregion

        #region Delete
        public async Task<DeleteInputDTO> Delete(DeleteInputDTO deleteDTO)
        {
            var entity = await _context.Users.Where(x => x.Id == deleteDTO.Id).FirstOrDefaultAsync();
            var login = await _context.Logins.Where(flt => flt.UserId == deleteDTO.Id).FirstOrDefaultAsync();
            _context.Logins.Remove(login);
            _context.Users.Remove(entity);
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
            var result = _context.AvailableMarkets.Where(x => x.CreatedById == (long)checkInputDTO.Id || x.ModifiedById == (long)checkInputDTO.Id).ToList();
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
            var result = await _context.Users.Where(x => x.Id != validationDTO.Id && x.Email == validationDTO.Title).ToListAsync();
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
                var entity = _context.Users.Where(flt => inputDTO.Ids.Contains(flt.Id)).ToList();
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
