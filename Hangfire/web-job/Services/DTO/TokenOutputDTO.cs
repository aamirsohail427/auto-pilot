using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace web_job.Services.DTO
{
    public class TokenOutputDTO
    {
        [JsonPropertyName("access_token")]
        public string access_token { get; set; }
    }
}
