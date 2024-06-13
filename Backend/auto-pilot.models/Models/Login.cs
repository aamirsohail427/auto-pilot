using System;
using System.Collections.Generic;

#nullable disable

namespace auto_pilot.models.Models
{
    public partial class Login
    {
        public long Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public long UserId { get; set; }
        public bool? IsLoginAllow { get; set; }
        public DateTime? LastLoginDate { get; set; }

        public virtual User User { get; set; }
    }
}
