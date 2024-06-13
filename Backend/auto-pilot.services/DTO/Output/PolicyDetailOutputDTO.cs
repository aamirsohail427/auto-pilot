using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO.Output
{
    public class PolicyDetailOutputDTO
    {
        public string AcordCode { get; set; }
        public string InternalCode { get; set; }
        public bool HasDetails { get; set; }
        public bool IsPackage { get; set; }
        public object LOBDetailsGroup { get; set; }
        public int ID { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
    }
}
