using System;
using System.Collections.Generic;

#nullable disable

namespace auto_pilot.models.Models
{
    public partial class User
    {
        public User()
        {
            AgencyCompanyAgencies = new HashSet<AgencyCompany>();
            AgencyCompanyCreatedBies = new HashSet<AgencyCompany>();
            AgencyCompanyModifiedBies = new HashSet<AgencyCompany>();
            AgencyUserAgencies = new HashSet<AgencyUser>();
            AgencyUserUsers = new HashSet<AgencyUser>();
            AppSettings = new HashSet<AppSetting>();
            AvailableMarketAgencies = new HashSet<AvailableMarket>();
            AvailableMarketCreatedBies = new HashSet<AvailableMarket>();
            AvailableMarketModifiedBies = new HashSet<AvailableMarket>();
            BusinessLineAgencies = new HashSet<BusinessLine>();
            BusinessLineCreatedBies = new HashSet<BusinessLine>();
            BusinessLineModifiedBies = new HashSet<BusinessLine>();
            BusinessTypeAgencies = new HashSet<BusinessType>();
            BusinessTypeCreatedBies = new HashSet<BusinessType>();
            BusinessTypeModifiedBies = new HashSet<BusinessType>();
            EmailTemplateCreatedBies = new HashSet<EmailTemplate>();
            EmailTemplateModifiedBies = new HashSet<EmailTemplate>();
            EmailTemplateSources = new HashSet<EmailTemplate>();
            InverseCreatedBy = new HashSet<User>();
            InverseModifiedBy = new HashSet<User>();
            Logins = new HashSet<Login>();
            UserTypeAgencies = new HashSet<UserType>();
            UserTypeCreatedBies = new HashSet<UserType>();
            UserTypeModifiedBies = new HashSet<UserType>();
        }

        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int? RoleId { get; set; }
        public long? CreatedById { get; set; }
        public DateTime? CreatedDate { get; set; }
        public long? ModifiedById { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsArchived { get; set; }
        public string ProfileImage { get; set; }

        public virtual User CreatedBy { get; set; }
        public virtual User ModifiedBy { get; set; }
        public virtual Role Role { get; set; }
        public virtual ICollection<AgencyCompany> AgencyCompanyAgencies { get; set; }
        public virtual ICollection<AgencyCompany> AgencyCompanyCreatedBies { get; set; }
        public virtual ICollection<AgencyCompany> AgencyCompanyModifiedBies { get; set; }
        public virtual ICollection<AgencyUser> AgencyUserAgencies { get; set; }
        public virtual ICollection<AgencyUser> AgencyUserUsers { get; set; }
        public virtual ICollection<AppSetting> AppSettings { get; set; }
        public virtual ICollection<AvailableMarket> AvailableMarketAgencies { get; set; }
        public virtual ICollection<AvailableMarket> AvailableMarketCreatedBies { get; set; }
        public virtual ICollection<AvailableMarket> AvailableMarketModifiedBies { get; set; }
        public virtual ICollection<BusinessLine> BusinessLineAgencies { get; set; }
        public virtual ICollection<BusinessLine> BusinessLineCreatedBies { get; set; }
        public virtual ICollection<BusinessLine> BusinessLineModifiedBies { get; set; }
        public virtual ICollection<BusinessType> BusinessTypeAgencies { get; set; }
        public virtual ICollection<BusinessType> BusinessTypeCreatedBies { get; set; }
        public virtual ICollection<BusinessType> BusinessTypeModifiedBies { get; set; }
        public virtual ICollection<EmailTemplate> EmailTemplateCreatedBies { get; set; }
        public virtual ICollection<EmailTemplate> EmailTemplateModifiedBies { get; set; }
        public virtual ICollection<EmailTemplate> EmailTemplateSources { get; set; }
        public virtual ICollection<User> InverseCreatedBy { get; set; }
        public virtual ICollection<User> InverseModifiedBy { get; set; }
        public virtual ICollection<Login> Logins { get; set; }
        public virtual ICollection<UserType> UserTypeAgencies { get; set; }
        public virtual ICollection<UserType> UserTypeCreatedBies { get; set; }
        public virtual ICollection<UserType> UserTypeModifiedBies { get; set; }
    }
}
