using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO
{
    public class MarketValidationDTO
    {
        public long Id { get; set; }
        public long InsuranceCompanyId { get; set; }
        public long AgencyId { get; set; }
        public long BusinessLineId { get; set; }
        public long BusinessTypeId { get; set; }
    }
}
