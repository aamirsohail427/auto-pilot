using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace auto_pilot.services.DTO.Output
{
    public class TokenOutputDTO
    {
        [JsonPropertyName("access_token")]
        public string access_token { get; set; }
    }
}
