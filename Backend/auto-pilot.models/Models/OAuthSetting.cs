using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.models.Models
{
    public class OAuthSetting
    {
        public int Id { get; set; }
        public int AgencyId { get; set; }
        public string grant_type { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string client_id { get; set; }
        public string client_secret { get; set; }
        public string LoginURL { get; set; }
        public string ApiURL { get; set; }
    }
}
