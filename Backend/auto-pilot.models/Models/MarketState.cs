using System;
using System.Collections.Generic;

#nullable disable

namespace auto_pilot.models.Models
{
    public partial class MarketState
    {
        public long MarketId { get; set; }
        public int StateId { get; set; }

        public virtual AvailableMarket Market { get; set; }
        public virtual State State { get; set; }
    }
}
