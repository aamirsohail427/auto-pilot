using auto_pilot.services.DTO.Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO.Output
{
    public class BusinessOutputDTO
    {
        public List<PoliciesDTO> Data { get; set; }
    }

    public class PolicyInfo
    {
        public PolicyInfoDTO Data { get; set; }
    }
    public class PoliciesDTO
    {
        public DateTime CreatedOn { get; set; }
        public DateTime DateLastModified { get; set; }
        public bool HasBeenModified { get; set; }
        public string Term { get; set; }
        public string PolicyType { get; set; }
        public object PackageType { get; set; }
        public bool IsDeleted { get; set; }
        public string AgentName { get; set; }
        public string MGA { get; set; }
        public string WritingCarrier { get; set; }
        public string LOB { get; set; }
        public string CustomerName { get; set; }
        public int PolicyId { get; set; }
        public int CustomerId { get; set; }
        public string PolicyNumber { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string Status { get; set; }
        public double TotalPremium { get; set; }
        public string Description { get; set; }
        public int LOBId { get; set; }
        public int? MGAId { get; set; }
        public int? CarrierId { get; set; }
    }

    public class CustomerSummaryDTO
    {
        public CustomerSummaryDetail Data { get; set; }
    }

    public class CustomerSummaryDetail
    {
        public int CustomerId { get; set; }
        public int AgentID { get; set; }
        public string AgentName { get; set; }
        public int CSRID { get; set; }
        public string CSRName { get; set; }
    }


    public class PolicyInfoDTO
    {
        public Guid Id { get; set; }
        public string CompanyName { get; set; }
        public string CustomerName { get; set; }
        public int PolicyID { get; set; }

        public string PolicyNo { get; set; }
        public int CustomerId { get; set; }
        public int? AgentID { get; set; }
        public string Agent { get; set; }
        public int? CsrID { get; set; }
        public string CSR { get; set; }

        public DateTime EffectiveDate { get; set; }
        public DateTime ExpirationDate { get; set; }

        public int LOBID { get; set; }

        public string LOB { get; set; }

        public string BusinessType { get; set; }

        public bool IsPending { get; set; }

        public string Status { get; set; }

        public bool NonRenewal { get; set; }

        public bool Reinstated { get; set; }

        public int? SublineID { get; set; }

        public string SublineName { get; set; }

        public string Carrier { get; set; }

        public string EffectiveDateString { get; set; }

        public string ExpirationDateString { get; set; }

        public int OpenSinceDays { get; set; }
        public int RemainingDays { get; set; }

    }
}
