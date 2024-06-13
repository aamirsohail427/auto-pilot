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
    public class ActionService : IActionService
    {
        private readonly IMapper _mapper;
        private readonly AutoPilotContext _context;

        public ActionService(IMapper mapper, AutoPilotContext context)
        {
            _mapper = mapper;
            _context = context;
        }


        public async Task<ActionDTO> GetByFilter(string path, long userId)
        {
            ActionDTO actionDTO = new ActionDTO();
            var roleId = await _context.Users.Where(u => u.Id == userId).Select(r => r.RoleId).FirstOrDefaultAsync();
            if(roleId == Convert.ToInt32(UserRole.User))
            {
                var userTypeId = await _context.AgencyUsers.Where(flt => flt.UserId == userId).Select(s => s.UserTypeId).FirstOrDefaultAsync();
                actionDTO = await (from MR in _context.RoleMenus.Where(flt => flt.UserTypeId == userTypeId)
                                   join MU in _context.Menus.Where(m => m.Path == path) on MR.MenuId equals MU.Id
                                   select new ActionDTO()
                                   {
                                       HasAddRight = MR.HasAddRight,
                                       HasEditRight = MR.HasEditRight,
                                       HasDeleteRight = MR.HasDeleteRight,
                                       HasViewRight = MR.HasViewRight
                                   }).FirstOrDefaultAsync();
            }
            else
            {
                actionDTO = new ActionDTO()
                {
                    HasAddRight = true,
                    HasEditRight = true,
                    HasDeleteRight = true,
                    HasViewRight = false
                };
            }
           
            return actionDTO;
        }

    }
}
