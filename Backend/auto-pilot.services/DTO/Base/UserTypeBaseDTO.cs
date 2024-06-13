using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO.Base
{
    public class UserTypeBaseDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public long AgencyId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public long CreatedById { get; set; }
        public long? ModifiedById { get; set; }

        public int TotalUsers { get; set; }

    }
}
