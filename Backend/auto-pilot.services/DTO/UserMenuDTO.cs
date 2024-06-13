using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO
{
    public class UserMenuDTO
    {
        public int Id { get; set; }
        public int UserTypeId { get; set; }
        public int MenuId { get; set; }

        public int? ParentId { get; set; }
        public bool? HasAddRight { get; set; }
        public bool? HasEditRight { get; set; }
        public bool? HasViewRight { get; set; }
        public bool? HasDeleteRight { get; set; }
    }
}
