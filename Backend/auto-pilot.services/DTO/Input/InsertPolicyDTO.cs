using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO.Input
{
    public class InsertPolicyDTO
    {
        public string Term { get; set; }
        public string PolicyType { get; set; }
        public string PackageType { get; set; }
        public List<int> PackageLobIDs { get; set; }
        public int CSRId { get; set; }
        public int AgentId { get; set; }
        public int PolicyId { get; set; }
        public int CustomerId { get; set; }
        public string PolicyNumber { get; set; }
        public string EffectiveDate { get; set; }
        public string ExpirationDate { get; set; }
        public string Status { get; set; }
        public double TotalPremium { get; set; }
        public string Description { get; set; }
        public int LOBId { get; set; }
        public int MGAId { get; set; }
        public int CarrierId { get; set; }
    }
}
