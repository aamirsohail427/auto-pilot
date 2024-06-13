using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace auto_pilot.services.DTO.Config
{
    public class OuthConfigDTO
    {
        public int Id { get; set; }
        public int AgencyId { get; set; }
        [JsonPropertyName("grant_type")]
        public string grant_type { get; set; }
        [JsonPropertyName("username")]
        public string username { get; set; }
        [JsonPropertyName("password")]
        public string password { get; set; }
        [JsonPropertyName("client_id")]
        public string client_id { get; set; }
        [JsonPropertyName("client_secret")]
        public string client_secret { get; set; }
        [JsonIgnore]
        public string LoginURL { get; set; }
        [JsonIgnore]
        public string ApiURL { get; set; }

    }
}
