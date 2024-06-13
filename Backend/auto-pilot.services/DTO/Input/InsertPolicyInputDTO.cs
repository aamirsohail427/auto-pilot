using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO.Input
{
    public class InsertPolicyInputDTO
    {
        public int AgencyId;

        public string Agent { get; set; }
        public string Line { get; set; }
        public string Company { get; set; }
        public string Csr { get; set; }
        public string Customer { get; set; }
        public string Status { get; set; }
        public string EffectiveDate { get; set; }
    }
}
