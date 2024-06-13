using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace web_job.Models
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

        public virtual DbSet<AgencyCompany> AgencyCompanies { get; set; } = null!;
        public virtual DbSet<AgencyUser> AgencyUsers { get; set; } = null!;
        public virtual DbSet<AppSetting> AppSettings { get; set; } = null!;
        public virtual DbSet<AvailableMarket> AvailableMarkets { get; set; } = null!;
        public virtual DbSet<BusinessLine> BusinessLines { get; set; } = null!;
        public virtual DbSet<BusinessType> BusinessTypes { get; set; } = null!;
        public virtual DbSet<EmailTemplate> EmailTemplates { get; set; } = null!;
        public virtual DbSet<Login> Logins { get; set; } = null!;
        public virtual DbSet<Menu> Menus { get; set; } = null!;
        public virtual DbSet<Policy> Policies { get; set; } = null!;
        public virtual DbSet<Role> Roles { get; set; } = null!;
        public virtual DbSet<RoleMenu> RoleMenus { get; set; } = null!;
        public virtual DbSet<State> States { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;
        public virtual DbSet<UserType> UserTypes { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=DESKTOP-9L14K4T\\AMIR;Database=AutoPilot;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AgencyCompany>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.ModifiedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.Title).HasMaxLength(250);

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

                entity.Property(e => e.CompanyName).HasMaxLength(50);

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

                entity.HasMany(d => d.States)
                    .WithMany(p => p.Markets)
                    .UsingEntity<Dictionary<string, object>>(
                        "MarketState",
                        l => l.HasOne<State>().WithMany().HasForeignKey("StateId").HasConstraintName("FK_States_StateId"),
                        r => r.HasOne<AvailableMarket>().WithMany().HasForeignKey("MarketId").HasConstraintName("FK_Markets_MarketId"),
                        j =>
                        {
                            j.HasKey("MarketId", "StateId");

                            j.ToTable("MarketStates");
                        });
            });

            modelBuilder.Entity<BusinessLine>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.ModifiedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.Title).HasMaxLength(250);

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

                entity.Property(e => e.Title).HasMaxLength(250);

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

                entity.Property(e => e.TemplateSubject).HasMaxLength(100);

                entity.Property(e => e.TemplateTitle).HasMaxLength(100);

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

                entity.Property(e => e.Password).HasMaxLength(100);

                entity.Property(e => e.Username).HasMaxLength(250);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Logins)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_Logins_Users");
            });

            modelBuilder.Entity<Menu>(entity =>
            {
                entity.Property(e => e.Icon).HasMaxLength(50);

                entity.Property(e => e.LevelType).HasMaxLength(50);

                entity.Property(e => e.Path).HasMaxLength(50);

                entity.Property(e => e.Text).HasMaxLength(250);
            });

            modelBuilder.Entity<Policy>(entity =>
            {
                entity.Property(e => e.Agent).HasMaxLength(100);

                entity.Property(e => e.AgentId).HasColumnName("AgentID");

                entity.Property(e => e.BusinessType).HasMaxLength(50);

                entity.Property(e => e.Csr)
                    .HasMaxLength(100)
                    .HasColumnName("CSR");

                entity.Property(e => e.CsrId).HasColumnName("CsrID");

                entity.Property(e => e.EffectiveDate).HasColumnType("smalldatetime");

                entity.Property(e => e.ExpirationDate).HasColumnType("smalldatetime");

                entity.Property(e => e.IsPending).HasDefaultValueSql("((0))");

                entity.Property(e => e.Lob)
                    .HasMaxLength(250)
                    .HasColumnName("LOB");

                entity.Property(e => e.Lobid).HasColumnName("LOBID");

                entity.Property(e => e.NonRenewal).HasDefaultValueSql("((0))");

                entity.Property(e => e.Period).HasMaxLength(100);

                entity.Property(e => e.PolicyId).HasColumnName("PolicyID");

                entity.Property(e => e.PolicyNo).HasMaxLength(50);

                entity.Property(e => e.PolicySource).HasMaxLength(50);

                entity.Property(e => e.PolicySourceId).HasColumnName("PolicySourceID");

                entity.Property(e => e.Reinstated).HasDefaultValueSql("((0))");

                entity.Property(e => e.Status).HasMaxLength(100);

                entity.Property(e => e.SublineId).HasColumnName("SublineID");

                entity.Property(e => e.SublineName).HasMaxLength(100);

                entity.HasOne(d => d.Agency)
                    .WithMany(p => p.Policies)
                    .HasForeignKey(d => d.AgencyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Policies_Users");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.Property(e => e.Title).HasMaxLength(100);
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
                entity.Property(e => e.Name).HasMaxLength(100);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.CreatedById, "IX_Users_CreatedById");

                entity.HasIndex(e => e.ModifiedById, "IX_Users_ModifiedById");

                entity.HasIndex(e => e.RoleId, "IX_Users_RoleId");

                entity.Property(e => e.CreatedDate).HasColumnType("smalldatetime");

                entity.Property(e => e.Email).HasMaxLength(250);

                entity.Property(e => e.FirstName).HasMaxLength(250);

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

                entity.Property(e => e.Title).HasMaxLength(100);

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
