using JobPortalWebAPI.Models.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace JobPortalWebAPI.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> dbContextOptions) : base(dbContextOptions)
        {
        }

        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<CompanyProfile> CompanyProfiles { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<SavedJob> SavedJobs { get; set; }
        public DbSet<JobApplication> JobApplications { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ApplicationUser has UserProfile, CompanyProfile where Email, Password, Id as common fields
            modelBuilder.Entity<UserProfile>()
           .HasOne(up => up.ApplicationUser)
           .WithOne(u => u.UserProfile)
           .HasForeignKey<UserProfile>(up => up.ApplicationUserId);

            modelBuilder.Entity<CompanyProfile>()
                .HasOne(cp => cp.ApplicationUser)
                .WithOne(u => u.CompanyProfile)
                .HasForeignKey<CompanyProfile>(cp => cp.ApplicationUserId);

            // Composite Key for SavedJob
            modelBuilder.Entity<SavedJob>()
                .HasKey(sj => new { sj.UserProfileId, sj.JobId });

            modelBuilder.Entity<SavedJob>()
                .HasOne(sj => sj.UserProfile)
                .WithMany(u => u.SavedJobs)
                .HasForeignKey(sj => sj.UserProfileId);

            modelBuilder.Entity<SavedJob>()
                .HasOne(sj => sj.Job)
                .WithMany(j => j.SavedByUsers)
                .HasForeignKey(sj => sj.JobId);

            // Seeding Role Data into DB
            var userRoleId = "a71a55d6-99d7-4123-b4e0-1218ecb90e3e";
            var recruiterRoleId = "c309fa92-2123-47be-b397-a1c77adb502c";
            var adminRoleId = "c309fa92-2123-47be-b397-a1c77adb502t";

            var roles = new List<IdentityRole>
            {
                new IdentityRole
                {
                    Id = userRoleId,
                    ConcurrencyStamp = userRoleId,
                    Name = "User",
                    NormalizedName = "User".ToUpper()
                },

                new IdentityRole
                {
                    Id = recruiterRoleId,
                    ConcurrencyStamp= recruiterRoleId,
                    Name = "Recruiter",
                    NormalizedName = "Recruiter".ToUpper()
                },

                new IdentityRole
                {
                    Id = adminRoleId,
                    ConcurrencyStamp= adminRoleId,
                    Name = "Admin",
                    NormalizedName = "Admin".ToUpper()
                }
            };

            modelBuilder.Entity<IdentityRole>().HasData(roles);
        }
    }
}
