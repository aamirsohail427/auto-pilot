using auto_pilot.services.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace auto_pilot.services.Interfaces
{
    public interface IActionService
    {
        public Task<ActionDTO> GetByFilter(string path, long userId);
    }
}
