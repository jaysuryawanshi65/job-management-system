using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobManagement.API.Migrations
{
    /// <inheritdoc />
    public partial class AddResumeToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ResumeFileName",
                table: "Users",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResumePath",
                table: "Users",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResumeFileName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ResumePath",
                table: "Users");
        }
    }
}
