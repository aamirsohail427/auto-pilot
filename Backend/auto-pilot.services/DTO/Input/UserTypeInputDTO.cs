using auto_pilot.services.DTO.Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO.Input
{
    public class UserTypeInputDTO: UserTypeBaseDTO
    {
        public List<UserMenuDTO> Permissions { get; set; }
    }
}
