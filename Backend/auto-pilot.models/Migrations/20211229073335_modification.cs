using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace auto_pilot.models.Migrations
{
    public partial class modification : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
               name: "OAuthSettings",
               columns: table => new
               {
                   Id = table.Column<int>(type: "int", nullable: false)
                       .Annotation("SqlServer:Identity", "1, 1"),
                   AgencyId = table.Column<int>(type: "int", nullable: false),
                   grant_type = table.Column<string>(type: "nvarchar(max)", nullable: true),
                   username = table.Column<string>(type: "nvarchar(max)", nullable: true),
                   password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                   client_id = table.Column<string>(type: "nvarchar(max)", nullable: true),
                   client_secret = table.Column<string>(type: "nvarchar(max)", nullable: true),
                   LoginURL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                   ApiURL = table.Column<string>(type: "nvarchar(max)", nullable: true)
               },
               constraints: table =>
               {
                   table.PrimaryKey("PK_OAuthSettings", x => x.Id);
               });
        }
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}