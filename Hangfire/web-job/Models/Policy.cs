using System;
using System.Collections.Generic;

namespace web_job.Models
{
    public partial class Policy
    {
        public long Id { get; set; }
        public long AgencyId { get; set; }
        public int PolicyId { get; set; }
        public string PolicyNo { get; set; } = null!;
        public int CustomerId { get; set; }
        public int AgentId { get; set; }
        public string Agent { get; set; } = null!;
        public int CsrId { get; set; }
        public string Csr { get; set; } = null!;
        public DateTime EffectiveDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public int Lobid { get; set; }
        public string Lob { get; set; } = null!;
        public string? BusinessType { get; set; }
        public bool? IsPending { get; set; }
        public string? Status { get; set; }
        public string? Period { get; set; }
        public int? PolicySourceId { get; set; }
        public string? PolicySource { get; set; }
        public bool? NonRenewal { get; set; }
        public bool? Reinstated { get; set; }
        public int? SublineId { get; set; }
        public string? SublineName { get; set; }

        public virtual User Agency { get; set; } = null!;
    }
}
