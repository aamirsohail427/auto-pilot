using System;
using System.Collections.Generic;

namespace web_job.Models
{
    public partial class RoleMenu
    {
        public long Id { get; set; }
        public int UserTypeId { get; set; }
        public int MenuId { get; set; }
        public bool? HasAddRight { get; set; }
        public bool? HasEditRight { get; set; }
        public bool? HasViewRight { get; set; }
        public bool? HasDeleteRight { get; set; }

        public virtual Menu Menu { get; set; } = null!;
        public virtual UserType UserType { get; set; } = null!;
    }
}
