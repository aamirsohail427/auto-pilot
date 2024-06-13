using System;
using System.Collections.Generic;

#nullable disable

namespace auto_pilot.models.Models
{
    public partial class EmailTemplate
    {
        public long Id { get; set; }
        public string TemplateTitle { get; set; }
        public string TemplateSubject { get; set; }
        public string TemplateContent { get; set; }
        public long CreatedById { get; set; }
        public DateTime CreatedDate { get; set; }
        public long? ModifiedById { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsArchived { get; set; }
        public string TemplateStructure { get; set; }
        public long? SourceId { get; set; }

        public virtual User CreatedBy { get; set; }
        public virtual User ModifiedBy { get; set; }
        public virtual User Source { get; set; }
    }
}
