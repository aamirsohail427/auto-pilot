
using System;
using System.Collections.Generic;
using System.Text;

namespace auto.services.DTO.Base
{
    public class AuthBaseDTO
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public bool? IsArchived { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public string Timezone { get; set; }
        public bool? IsLoginAllow { get; set; }
    }
}
