using System;
using System.Collections.Generic;
using System.Text;

namespace auto.services.DTO.Base
{
    public class UserBaseDTO
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public long CreatedById { get; set; }
        public long? ModifiedById { get; set; }
        public string Password { get; set; }
        public int? RoleId { get; set; }
        public bool IsArchived { get; set; }
        public string ProfileImage { get; set; }
        public int UserTypeId { get; set; }
        public bool? IsLoginAllow { get; set; }
        public DateTime? LastLoginDate { get; set; }
    }
}
