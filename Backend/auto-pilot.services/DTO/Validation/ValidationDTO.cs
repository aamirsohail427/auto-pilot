using System;
using System.Collections.Generic;
using System.Text;

namespace auto.services.DTO.Validation
{
    public class ValidationDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public long InsuranceCompanyId { get; set; }
        public long AgencyId { get; set; }
    }
}
