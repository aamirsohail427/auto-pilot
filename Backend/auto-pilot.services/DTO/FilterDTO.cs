using System;
using System.Collections.Generic;
using System.Text;

namespace auto.services.DTO
{
    public class FilterDTO
    {
        public long Id { get; set; }
        public string activeState { get; set; }
        public int AgencyId { get; set; }
    }
}
