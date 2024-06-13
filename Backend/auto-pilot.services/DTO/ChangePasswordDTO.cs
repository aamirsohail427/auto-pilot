using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace auto.services.DTO
{
    public class ChangePasswordDTO
    {
        public long Id { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
