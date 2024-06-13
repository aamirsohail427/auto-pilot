using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO.Base
{
    public class PolicyBaseDTO
    {
        public int PageNumber { get; set; }
        public int PagesTotal { get; set; }
        public int TotalItems { get; set; }
        public bool IsSuccess { get; set; }
        public object ErrorCode { get; set; }
        public object ErrorMessage { get; set; }
        public object DisplayMessage { get; set; }
        public string Href { get; set; }
    }
}
