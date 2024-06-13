using System;
using System.Collections.Generic;

#nullable disable

namespace auto_pilot.models.Models
{
    public partial class State
    {
        public State()
        {
            MarketStates = new HashSet<MarketState>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<MarketState> MarketStates { get; set; }
    }
}
