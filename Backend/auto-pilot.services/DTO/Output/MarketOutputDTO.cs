using auto_pilot.services.DTO.Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO.Output
{
    public class MarketOutputDTO : MarketBaseDTO
    {
        public string ModifiedBy{set;get;}
        public string Favorite { set; get; }
        public string BusinessWirth { get; set; }

        public string InsuranceCompany { get; set; }
        public string Type { get; set; }
        public string Line { get; set; }
        public string Company { get; set; }
        public string MarketStates { get; set; }
        public List<int> States { get; set; }
    }
}
