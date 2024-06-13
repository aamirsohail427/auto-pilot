using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO
{
    public class UpdatePasswordDTO
    {
        public long Id { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }
}
