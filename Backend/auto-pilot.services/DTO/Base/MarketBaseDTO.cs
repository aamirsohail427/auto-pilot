using auto.services.DTO.Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO.Base
{
    public class MarketBaseDTO
    {
        public long Id { get; set; }
        public long InsuranceCompanyId { get; set; }
        public long AgencyId { get; set; }
        public bool? Wirth { get; set; }
        public long BusinessLineId { get; set; }
        public long BusinessTypeId { get; set; }
        public bool? IsFavorite { get; set; }
        public string Notes { get; set; }
        public long? CreatedById { get; set; }
        public DateTime? CreatedDate { get; set; }
        public long? ModifiedById { get; set; }
        public DateTime? ModifiedDate { get; set; }

        public List<int> SelectedStates { get; set; }

    }
}
