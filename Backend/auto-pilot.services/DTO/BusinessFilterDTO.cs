using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO
{
    public class BusinessFilterDTO
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
