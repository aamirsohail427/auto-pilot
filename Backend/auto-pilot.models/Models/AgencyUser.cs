using System;
using System.Collections.Generic;

#nullable disable

namespace auto_pilot.models.Models
{
    public partial class AgencyUser
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public long AgencyId { get; set; }
        public int UserTypeId { get; set; }

        public virtual User Agency { get; set; }
        public virtual User User { get; set; }
        public virtual UserType UserType { get; set; }
    }
}
