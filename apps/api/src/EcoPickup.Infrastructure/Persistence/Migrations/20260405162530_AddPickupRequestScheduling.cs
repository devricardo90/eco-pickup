using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EcoPickup.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddPickupRequestScheduling : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ConfirmedPickupWindowEndUtc",
                table: "pickup_requests",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ConfirmedPickupWindowStartUtc",
                table: "pickup_requests",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConfirmedPickupWindowEndUtc",
                table: "pickup_requests");

            migrationBuilder.DropColumn(
                name: "ConfirmedPickupWindowStartUtc",
                table: "pickup_requests");
        }
    }
}
