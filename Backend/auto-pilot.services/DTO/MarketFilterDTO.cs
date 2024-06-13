using auto_pilot.services.DTO.Output;
using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO
{
    public class MarketFilterDTO
    {
        public long Id { get; set; }
        public long LineId { get; set; }
        public long TypeId { get; set; }
        public int StateId { get; set; }
      
    }
}
