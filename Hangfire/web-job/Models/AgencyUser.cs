using System;
using System.Collections.Generic;

namespace web_job.Models
{
    public partial class AgencyUser
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public long AgencyId { get; set; }
        public int UserTypeId { get; set; }

        public virtual User Agency { get; set; } = null!;
        public virtual User User { get; set; } = null!;
        public virtual UserType UserType { get; set; } = null!;
    }
}
