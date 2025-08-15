using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPortalWebAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedUserProfilemodel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "UserProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "UserProfiles");
        }
    }
}
