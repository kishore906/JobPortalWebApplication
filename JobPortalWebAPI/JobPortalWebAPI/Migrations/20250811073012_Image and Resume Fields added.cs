using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPortalWebAPI.Migrations
{
    /// <inheritdoc />
    public partial class ImageandResumeFieldsadded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfileImagePath",
                table: "UserProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResumeFilePath",
                table: "UserProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanyImagePath",
                table: "CompanyProfiles",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfileImagePath",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "ResumeFilePath",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "CompanyImagePath",
                table: "CompanyProfiles");
        }
    }
}
