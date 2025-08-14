using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPortalWebAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddedsomemodelpropertiesinJobApplicationandJob : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "JobCategory",
                table: "Jobs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "JobResume",
                table: "JobApplications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "JobCategory",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "JobResume",
                table: "JobApplications");
        }
    }
}
