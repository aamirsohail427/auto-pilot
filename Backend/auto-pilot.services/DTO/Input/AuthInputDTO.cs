using auto.services.DTO.Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace auto.services.DTO.Input
{
    public class AuthInputDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }
}
