using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO.Base
{
    public class EmailTemplateBaseDTO
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
    }
}
