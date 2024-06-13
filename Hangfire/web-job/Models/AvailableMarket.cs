using System;
using System.Collections.Generic;

namespace web_job.Models
{
    public partial class AvailableMarket
    {
        public AvailableMarket()
        {
            States = new HashSet<State>();
        }

        public long Id { get; set; }
        public long InsuranceCompanyId { get; set; }
        public long AgencyId { get; set; }
        public bool? Wirth { get; set; }
        public long BusinessLineId { get; set; }
        public long BusinessTypeId { get; set; }
        public bool? IsFavorite { get; set; }
        public string? Notes { get; set; }
        public long? CreatedById { get; set; }
        public DateTime? CreatedDate { get; set; }
        public long? ModifiedById { get; set; }
        public DateTime? ModifiedDate { get; set; }

        public virtual User Agency { get; set; } = null!;
        public virtual User? CreatedBy { get; set; }
        public virtual User? ModifiedBy { get; set; }

        public virtual ICollection<State> States { get; set; }
    }
}
