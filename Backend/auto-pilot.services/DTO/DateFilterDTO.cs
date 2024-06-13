using System;
using System.Collections.Generic;
using System.Text;

namespace auto.services.DTO
{
    public class DateFilterDTO
    {
        public long? UserId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}
