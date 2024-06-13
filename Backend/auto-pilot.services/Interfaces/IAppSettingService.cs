using auto_pilot.services.DTO;
using auto_pilot.services.DTO.Output;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace auto_pilot.services.Interfaces
{
    public interface IAppSettingService
    {
        public Task<AppSettingDTO> GetById(long agencyId);
        public Task<AppSettingDTO> UpdateSettings(AppSettingDTO settingDTO);
    }
}
