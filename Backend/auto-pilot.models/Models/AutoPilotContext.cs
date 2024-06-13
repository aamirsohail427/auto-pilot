using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace auto_pilot.models.Models
{
    public partial class AutoPilotContext : DbContext
    {
        public AutoPilotContext()
        {
        }

        public AutoPilotContext(DbContextOptions<AutoPilotContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AgencyCompany> AgencyCompanies { get; set; }
        public virtual DbSet<AgencyUser> AgencyUsers { get; set; }
        public virtual DbSet<AppSetting> AppSettings { get; set; }
        public virtual DbSet<AvailableMarket> AvailableMarkets { get; set; }
        public virtual DbSet<BusinessLine> BusinessLines { get; set; }
        public virtual DbSet<BusinessType> BusinessTypes { get; set; }
        public virtual DbSet<EmailTemplate> EmailTemplates { get; set; }
        public virtual DbSet<Login> Logins { get; set; }
        public virtual DbSet<MarketState> MarketStates { get; set; }
        public virtual DbSet<Menu> Menus { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<RoleMenu> RoleMenus { get; set; }
        public virtual DbSet<State> States { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserType> UserTypes { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=DESKTOP-9L14K4T\\AMIR;Database=AutoPilot;User Id=sa;Password=@dmin123;Trusted_Connection=False;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<AgencyCompany>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.ModifiedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.HasOne(d => d.Agency)
                    .WithMany(p => p.AgencyCompanyAgencies)
                    .HasForeignKey(d => d.AgencyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Companies_Agency");

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.AgencyCompanyCreatedBies)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Companies_CreatedBy");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.AgencyCompanyModifiedBies)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_Companies_ModifiedBy");
            });

            modelBuilder.Entity<AgencyUser>(entity =>
            {
                entity.HasIndex(e => e.AgencyId, "IX_AgencyUsers_AgencyId");

                entity.HasIndex(e => e.UserId, "IX_AgencyUsers_UserId");

                entity.HasIndex(e => e.UserTypeId, "IX_AgencyUsers_UserTypeId");

                entity.HasOne(d => d.Agency)
                    .WithMany(p => p.AgencyUserAgencies)
                    .HasForeignKey(d => d.AgencyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Agency_AgencyId");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AgencyUserUsers)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Users_UserId");

                entity.HasOne(d => d.UserType)
                    .WithMany(p => p.AgencyUsers)
                    .HasForeignKey(d => d.UserTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Users_UserTypes");
            });

            modelBuilder.Entity<AppSetting>(entity =>
            {
                entity.Property(e => e.BillingAddress).HasMaxLength(100);

                entity.Property(e => e.ClientId).HasMaxLength(250);

                entity.Property(e => e.ClientSecret).HasMaxLength(250);

                entity.Property(e => e.CompanyName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.LogoUrl).HasMaxLength(500);

                entity.Property(e => e.Password).HasMaxLength(100);

                entity.Property(e => e.PrimaryEmail).HasMaxLength(50);

                entity.Property(e => e.ShippingAddress).HasMaxLength(100);

                entity.Property(e => e.Smtp)
                    .HasMaxLength(50)
                    .HasColumnName("SMTP");

                entity.Property(e => e.Smtpassword)
                    .HasMaxLength(50)
                    .HasColumnName("SMTPassword");

                entity.Property(e => e.UserName).HasMaxLength(100);

                entity.HasOne(d => d.Agency)
                    .WithMany(p => p.AppSettings)
                    .HasForeignKey(d => d.AgencyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppSettings_Users");
            });

            modelBuilder.Entity<AvailableMarket>(entity =>
            {
                entity.HasIndex(e => e.AgencyId, "IX_AvailableMarkets_AgencyId");

                entity.HasIndex(e => e.CreatedById, "IX_AvailableMarkets_CreatedById");

                entity.HasIndex(e => e.ModifiedById, "IX_AvailableMarkets_ModifiedById");

                entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.IsFavorite).HasDefaultValueSql("((0))");

                entity.Property(e => e.ModifiedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.Wirth).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Agency)
                    .WithMany(p => p.AvailableMarketAgencies)
                    .HasForeignKey(d => d.AgencyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Markets_Agency");

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.AvailableMarketCreatedBies)
                    .HasForeignKey(d => d.CreatedById)
                    .HasConstraintName("FK_Markets_CreatedBy");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.AvailableMarketModifiedBies)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_Markets_ModifyBy");
            });

            modelBuilder.Entity<BusinessLine>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.ModifiedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.HasOne(d => d.Agency)
                    .WithMany(p => p.BusinessLineAgencies)
                    .HasForeignKey(d => d.AgencyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_BusinessLines_Agency");

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.BusinessLineCreatedBies)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_BusinessLines_CreatedBy");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.BusinessLineModifiedBies)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_BusinessLines_ModifiedBy");
            });

            modelBuilder.Entity<BusinessType>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.ModifiedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.HasOne(d => d.Agency)
                    .WithMany(p => p.BusinessTypeAgencies)
                    .HasForeignKey(d => d.AgencyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_BusinessTypes_Agency");

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.BusinessTypeCreatedBies)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_BusinessTypes_CreatedBy");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.BusinessTypeModifiedBies)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_BusinessTypes_ModifiedBy");
            });

            modelBuilder.Entity<EmailTemplate>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.ModifiedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.TemplateContent).IsRequired();

                entity.Property(e => e.TemplateSubject)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.TemplateTitle)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.EmailTemplateCreatedBies)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_EmailTemplates_Source");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.EmailTemplateModifiedBies)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_EmailTemplates_ModifiedBy");

                entity.HasOne(d => d.Source)
                    .WithMany(p => p.EmailTemplateSources)
                    .HasForeignKey(d => d.SourceId)
                    .HasConstraintName("FK_EmailTemplates_CreatedBy");
            });

            modelBuilder.Entity<Login>(entity =>
            {
                entity.HasIndex(e => e.UserId, "IX_Logins_UserId");

                entity.Property(e => e.IsLoginAllow).HasDefaultValueSql("((0))");

                entity.Property(e => e.LastLoginDate).HasColumnType("smalldatetime");

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Logins)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_Logins_Users");
            });

            modelBuilder.Entity<MarketState>(entity =>
            {
                entity.HasKey(e => new { e.MarketId, e.StateId });

                entity.HasOne(d => d.Market)
                    .WithMany(p => p.MarketStates)
                    .HasForeignKey(d => d.MarketId)
                    .HasConstraintName("FK_Markets_MarketId");

                entity.HasOne(d => d.State)
                    .WithMany(p => p.MarketStates)
                    .HasForeignKey(d => d.StateId)
                    .HasConstraintName("FK_States_StateId");
            });

            modelBuilder.Entity<Menu>(entity =>
            {
                entity.Property(e => e.Icon).HasMaxLength(50);

                entity.Property(e => e.LevelType)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Path).HasMaxLength(50);

                entity.Property(e => e.Text)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<RoleMenu>(entity =>
            {
                entity.Property(e => e.HasAddRight).HasDefaultValueSql("((0))");

                entity.Property(e => e.HasDeleteRight).HasDefaultValueSql("((0))");

                entity.Property(e => e.HasEditRight).HasDefaultValueSql("((0))");

                entity.Property(e => e.HasViewRight).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Menu)
                    .WithMany(p => p.RoleMenus)
                    .HasForeignKey(d => d.MenuId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RoleMenus_Menus");

                entity.HasOne(d => d.UserType)
                    .WithMany(p => p.RoleMenus)
                    .HasForeignKey(d => d.UserTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RoleMenus_UserTypes");
            });

            modelBuilder.Entity<State>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.CreatedById, "IX_Users_CreatedById");

                entity.HasIndex(e => e.ModifiedById, "IX_Users_ModifiedById");

                entity.HasIndex(e => e.RoleId, "IX_Users_RoleId");

                entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.LastName).HasMaxLength(250);

                entity.Property(e => e.ModifiedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.Phone).HasMaxLength(50);

                entity.Property(e => e.ProfileImage).HasMaxLength(250);

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.InverseCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .HasConstraintName("FK_Users_CreatedBy");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.InverseModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_Users_ModifiedBy");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK_Users_Roles");
            });

            modelBuilder.Entity<UserType>(entity =>
            {
                entity.HasIndex(e => e.AgencyId, "IX_UserTypes_AgencyId");

                entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.IsArchived).HasDefaultValueSql("((0))");

                entity.Property(e => e.ModifiedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasOne(d => d.Agency)
                    .WithMany(p => p.UserTypeAgencies)
                    .HasForeignKey(d => d.AgencyId)
                    .HasConstraintName("FK_UserTypes_Agency");

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.UserTypeCreatedBies)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserTypes_CreatedBy");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.UserTypeModifiedBies)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_UserTypes_ModifiedBy");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
