using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO
{
    public class ActionDTO
    {
        public long UserId { get; set; }
        public string RouteName { get; set; }
        public bool? HasAddRight { get; set; }
        public bool? HasEditRight { get; set; }
        public bool? HasViewRight { get; set; }
        public bool? HasDeleteRight { get; set; }
    }
}
