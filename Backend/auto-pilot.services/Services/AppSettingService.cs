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
    public class AppSettingService : IAppSettingService
    {
        private readonly IMapper _mapper;
        private readonly AutoPilotContext _context;

        public AppSettingService(IMapper mapper, AutoPilotContext context)
        {
            _mapper = mapper;
            _context = context;
        }


        public async Task<AppSettingDTO> GetById(long agencyId)
        {
            AppSettingDTO outputDTO = new AppSettingDTO();
            var entity = await _context.AppSettings.Where(flt => flt.AgencyId == agencyId).FirstOrDefaultAsync();
            outputDTO = _mapper.Map<AppSettingDTO>( entity);
            return outputDTO;
        }

        public async Task<AppSettingDTO> UpdateSettings(AppSettingDTO settingDTO)
        {
            var entity = await _context.AppSettings.Where(flt => flt.Id == settingDTO.Id).FirstOrDefaultAsync();
            var mapped = _mapper.Map<AppSettingDTO, AppSetting>(settingDTO, entity);
            await _context.SaveChangesAsync();
            return settingDTO;
        }
    }
}
