using System;
using System.Collections.Generic;

namespace web_job.Models
{
    public partial class UserType
    {
        public UserType()
        {
            AgencyUsers = new HashSet<AgencyUser>();
            RoleMenus = new HashSet<RoleMenu>();
        }

        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public long AgencyId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public long CreatedById { get; set; }
        public long? ModifiedById { get; set; }
        public bool? IsArchived { get; set; }

        public virtual User Agency { get; set; } = null!;
        public virtual User CreatedBy { get; set; } = null!;
        public virtual User? ModifiedBy { get; set; }
        public virtual ICollection<AgencyUser> AgencyUsers { get; set; }
        public virtual ICollection<RoleMenu> RoleMenus { get; set; }
    }
}
