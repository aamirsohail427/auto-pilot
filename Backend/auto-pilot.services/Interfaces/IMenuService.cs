using auto_pilot.services.DTO.Output;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace auto_pilot.services.Interfaces
{
    public interface IMenuService
    {
        public Task<List<MenuOutputDTO>> GetMenus(long Id);
    }
}
