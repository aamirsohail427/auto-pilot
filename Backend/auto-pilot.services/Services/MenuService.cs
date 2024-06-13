using auto.services.Enums;
using auto_pilot.models.Models;
using auto_pilot.services.DTO;
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
    public class MenuService : IMenuService
    {
        private readonly IMapper _mapper;
        private readonly AutoPilotContext _context;

        public MenuService(IMapper mapper, AutoPilotContext context)
        {
            _mapper = mapper;
            _context = context;
        }


        public async Task<List<MenuOutputDTO>> GetMenus(long Id)
        {
            List<MenuOutputDTO> menuDTO = new List<MenuOutputDTO>();
            var entity = await _context.Users.Where(l => l.Id == Id).FirstOrDefaultAsync();
            var typeId = _context.AgencyUsers.Where(flt => flt.UserId == Id).Select(s => s.UserTypeId).FirstOrDefault();
            if (entity.RoleId == Convert.ToInt32(UserRole.User))
            {
                menuDTO = await (from RM in _context.RoleMenus.Where(m => m.UserTypeId == typeId && (m.HasAddRight != false || m.HasEditRight != false || m.HasDeleteRight != false || m.HasViewRight != false))
                                 join MU in _context.Menus on RM.MenuId equals MU.Id
                                 select new MenuOutputDTO()
                                 {
                                     Id = MU.Id,
                                     Text = MU.Text,
                                     Path = MU.Path,
                                     Icon = MU.Icon,
                                     ParentId = MU.ParentId,
                                     LevelType = MU.LevelType,
                                     Items = (from menus in _context.Menus.Where(m => m.ParentId == MU.Id)
                                              join roleMenus in _context.RoleMenus.Where(m => m.UserTypeId == typeId && (m.HasAddRight != false || m.HasEditRight != false || m.HasDeleteRight != false || m.HasViewRight != false)) on menus.Id equals roleMenus.MenuId
                                              select new MenuOutputDTO()
                                              {
                                                  Id = menus.Id,
                                                  Text = menus.Text,
                                                  Path = menus.Path,
                                                  Icon = menus.Icon,
                                                  ParentId = menus.ParentId,
                                                  LevelType = menus.LevelType,
                                              }).ToList()

                                 }).ToListAsync();

                menuDTO = menuDTO.Where(flt => flt.ParentId == null && flt.LevelType.ToLower() == "agency").ToList();

            }
            else if (entity.RoleId == Convert.ToInt32(UserRole.Agency))
            {
                menuDTO = await GetRoleMenus("agency");
            }
            else
            {
                menuDTO = await GetRoleMenus("admin");
            }
            return menuDTO;
        }

        public async Task<List<MenuOutputDTO>> GetRoleMenus(string role)
        {
            List<MenuOutputDTO> menuDTO = new List<MenuOutputDTO>();
            var menus = await _context.Menus.Where(m => m.LevelType.ToLower() == role && m.ParentId == null).OrderBy(o => o.OrderNum).ToListAsync();
            foreach (var item in menus)
            {
                MenuOutputDTO menuOutput = new MenuOutputDTO();
                menuOutput = _mapper.Map<Menu, MenuOutputDTO>(item);
                menuOutput.Items = _mapper.Map<List<Menu>, List<MenuOutputDTO>>(_context.Menus.Where(m => m.ParentId == item.Id).OrderBy(o => o.OrderNum).ToList());
                menuDTO.Add(menuOutput);
            }
            return menuDTO;
        }
    }
}
