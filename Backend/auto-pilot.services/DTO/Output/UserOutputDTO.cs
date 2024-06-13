using auto.services.DTO.Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace auto.services.DTO.Output
{
    public class UserOutputDTO : UserBaseDTO
    {
        public string Name { get; set; }
        public string UserType { get; set; }
        public string ModifiedBy { set; get; }
        public DateTime? ModifiedDate { get; set; }
    }
}
