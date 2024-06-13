using System;
using System.Collections.Generic;

namespace web_job.Models
{
    public partial class Login
    {
        public long Id { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public long UserId { get; set; }
        public bool? IsLoginAllow { get; set; }
        public DateTime? LastLoginDate { get; set; }

        public virtual User User { get; set; } = null!;
    }
}
