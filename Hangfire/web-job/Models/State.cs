using System;
using System.Collections.Generic;

namespace web_job.Models
{
    public partial class State
    {
        public State()
        {
            Markets = new HashSet<AvailableMarket>();
        }

        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public virtual ICollection<AvailableMarket> Markets { get; set; }
    }
}
