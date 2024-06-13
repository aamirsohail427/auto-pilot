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
    public class UserTypeService : IUserTypeService
    {
        private readonly IMapper _mapper;
        private readonly AutoPilotContext _context;

        public UserTypeService(IMapper mapper, AutoPilotContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        #region List
        public async Task<List<UserTypeOutputDTO>> GetByFilter(long Id)
        {
            List<UserTypeOutputDTO> outputDTO = new List<UserTypeOutputDTO>();
            outputDTO = await (from UT in _context.UserTypes.Where(flt => flt.AgencyId == Id)
                               join UC in _context.Users on UT.CreatedById equals UC.Id
                               join UM in _context.Users on UT.ModifiedById equals UM.Id into MD
                               from MU in MD.DefaultIfEmpty()

                               select new UserTypeOutputDTO()
                               {
                                   Id = UT.Id,
                                   AgencyId = UT.AgencyId,
                                   Title = UT.Title,
                                   ModifiedBy = UT.ModifiedById == null ? SystemUtility.DisplayFullName(UC.FirstName, UC.LastName) : SystemUtility.DisplayFullName(MU.FirstName, MU.LastName),
                                   ModifiedDate = UT.ModifiedDate == null ? UT.CreatedDate : UT.ModifiedDate,
                                   TotalUsers = _context.AgencyUsers.Where(au => au.UserTypeId == UT.Id).Count()
                               }).ToListAsync();
            return outputDTO;
        }
        #endregion

        #region Details
        public async Task<UserTypeOutputDTO> GetById(long Id)
        {
            var result = await _context.UserTypes.Where(flt => flt.Id == Id).FirstOrDefaultAsync();
            return _mapper.Map<UserTypeOutputDTO>(result); ;
        }

        public async Task<UserTypeOutputDTO> Create(UserTypeInputDTO inputDTO)
        {
            var entity = _mapper.Map<UserType>(inputDTO);
            entity.CreatedDate = DateTime.Now;
            if (inputDTO.Permissions.Where(p => p.ParentId != null).Count() > 0)
            {
                UserMenuDTO menuDTO = new UserMenuDTO();
                menuDTO.MenuId = Convert.ToInt32(inputDTO.Permissions.Where(w => w.ParentId != null).Select(s => s.ParentId).FirstOrDefault());
                menuDTO.ParentId = null;
                menuDTO.HasAddRight = true;
                menuDTO.HasEditRight = true;
                menuDTO.HasDeleteRight = true;
                menuDTO.HasViewRight = true;
                inputDTO.Permissions.Add(menuDTO);
            }
            entity.RoleMenus = _mapper.Map<List<UserMenuDTO>, List<RoleMenu>>(inputDTO.Permissions);
            await _context.UserTypes.AddAsync(entity);
            await _context.SaveChangesAsync();
            return _mapper.Map<UserTypeOutputDTO>(entity);
        }

        public async Task<UserTypeOutputDTO> Update(UserTypeInputDTO inputDTO)
        {
            var entity = await _context.UserTypes.FirstOrDefaultAsync(x => x.Id == inputDTO.Id);
            var mapped = _mapper.Map<UserTypeInputDTO, UserType>(inputDTO, entity);
            mapped.ModifiedDate = DateTime.Now;

            var typeEntity = await _context.RoleMenus.Where(x => x.UserTypeId == entity.Id).ToListAsync();
            _context.RoleMenus.RemoveRange(typeEntity);
            mapped.RoleMenus = _mapper.Map<List<UserMenuDTO>, List<RoleMenu>>(inputDTO.Permissions);
            await _context.SaveChangesAsync();
            return _mapper.Map<UserTypeOutputDTO>(mapped);
        }

        public async Task<List<RoleMenuDTO>> GetUserTypeMenus(int Id)
        {
            List<RoleMenuDTO> menuDTO = new List<RoleMenuDTO>();
            menuDTO = await (from RM in _context.RoleMenus.Where(flt => flt.UserTypeId == Id)
                             join MU in _context.Menus on RM.MenuId equals MU.Id
                             select new RoleMenuDTO()
                             {
                                 Id = RM.Id,
                                 UserTypeId = RM.UserTypeId,
                                 MenuId = MU.Id,
                                 Title = MU.Text,
                                 HasAddRight = RM.HasAddRight,
                                 HasEditRight = RM.HasEditRight,
                                 HasDeleteRight = RM.HasDeleteRight,
                                 HasViewRight = RM.HasViewRight
                             }).ToListAsync();
            return menuDTO;
        }
        public async Task<List<RoleMenuDTO>> GetRoleMenus()
        {
            List<RoleMenuDTO> menuDTO = new List<RoleMenuDTO>();
            var menus = await _context.Menus.Where(flt => flt.Text.ToLower() != "settings" && flt.LevelType.ToLower() == "agency").ToListAsync();
            foreach (var item in menus)
            {
                RoleMenuDTO roleMenu = new RoleMenuDTO();
                roleMenu.MenuId = item.Id;
                roleMenu.Title = item.Text;
                roleMenu.HasAddRight = false;
                roleMenu.HasEditRight = false;
                roleMenu.HasDeleteRight = false;
                roleMenu.HasViewRight = false;
                roleMenu.ParentId = item.ParentId;
                menuDTO.Add(roleMenu);
            }
            return menuDTO;
        }

        #endregion

        #region Delete
        public async Task<DeleteInputDTO> Delete(DeleteInputDTO deleteDTO)
        {
            var entity = await _context.UserTypes.Where(x => x.Id == deleteDTO.Id).FirstOrDefaultAsync();
            _context.UserTypes.Remove(entity);
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
            var result = _context.AgencyUsers.Where(x => x.UserTypeId == (long)checkInputDTO.Id).ToList();
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
            var result = await _context.UserTypes.Where(x => x.Id != validationDTO.Id && x.Title == validationDTO.Title && x.AgencyId == validationDTO.AgencyId).ToListAsync();
            if (result.Count > 0)
            {
                validationResultDTO.IsValid = false;
            }
            return validationResultDTO;
        }
        #endregion
    }
}
