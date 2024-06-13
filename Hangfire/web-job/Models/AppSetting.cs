using System;
using System.Collections.Generic;

namespace web_job.Models
{
    public partial class AppSetting
    {
        public long Id { get; set; }
        public long AgencyId { get; set; }
        public string CompanyName { get; set; } = null!;
        public string? BillingAddress { get; set; }
        public string? ShippingAddress { get; set; }
        public int? Severe { get; set; }
        public int? Moderate { get; set; }
        public int? Low { get; set; }
        public string? PrimaryEmail { get; set; }
        public string? Smtp { get; set; }
        public string? Smtpassword { get; set; }
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string? ClientId { get; set; }
        public string? ClientSecret { get; set; }
        public string? LogoUrl { get; set; }

        public virtual User Agency { get; set; } = null!;
    }
}
