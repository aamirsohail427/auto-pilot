using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO.Output
{
    public class PolicyInfoOutputDTO
    {
        public int PolicyID { get; set; }
        public string PolicyNo { get; set; }
        public string BillTypeID { get; set; }
        public int CustomerID { get; set; }
        public int AgentID { get; set; }
        public string Agent { get; set; }
        public int CsrID { get; set; }
        public string CSR { get; set; }
        public string CreatedBy { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string PolicyClass { get; set; }
        public object CarrierID { get; set; }
        public object Carrier { get; set; }
        public object MGAID { get; set; }
        public object MGA { get; set; }
        public int LOBID { get; set; }
        public string LOB { get; set; }
        public DateTime BinderDate { get; set; }
        public object BinderNumber { get; set; }
        public string BusinessType { get; set; }
        public object PremiumSent { get; set; }
        public bool isPending { get; set; }
        public string Status { get; set; }
        public string Period { get; set; }
        public int PolicySourceID { get; set; }
        public string PolicySource { get; set; }
        public string PolicySourceDetails { get; set; }
        public string Description { get; set; }
        public object ParentCarrierID { get; set; }
        public object ParentCarrier { get; set; }
        public bool NonRenewal { get; set; }
        public bool Reinstated { get; set; }
        public object SublineID { get; set; }
        public object SublineName { get; set; }
        public object CarrierNAIC { get; set; }
        public string BinderDateString { get; set; }
        public string EffectiveDateString { get; set; }
        public string ExpirationDateString { get; set; }
    }
}
