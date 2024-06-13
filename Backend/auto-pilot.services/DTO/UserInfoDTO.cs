using auto_pilot.services.DTO.Output;
using System;
using System.Collections.Generic;
using System.Text;

namespace auto.services.DTO
{
    public class UserInfoDTO
    {
        public long Id { get; set; }
        public long LoginId { get; set; }
        public string AuthToken { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? RoleId { get; set; }
        public long? CreatedById { get; set; }
        public string LogoText { get; set; }

        public string LogoUrl { get; set; }

        public List<MenuOutputDTO> Menus { get; set; }
    }
}
