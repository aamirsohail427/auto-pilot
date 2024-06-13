using System;
using System.Collections.Generic;

#nullable disable

namespace auto_pilot.models.Models
{
    public partial class BusinessLine
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public long AgencyId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public long CreatedById { get; set; }
        public long? ModifiedById { get; set; }
        public bool IsArchived { get; set; }

        public virtual User Agency { get; set; }
        public virtual User CreatedBy { get; set; }
        public virtual User ModifiedBy { get; set; }
    }
}
