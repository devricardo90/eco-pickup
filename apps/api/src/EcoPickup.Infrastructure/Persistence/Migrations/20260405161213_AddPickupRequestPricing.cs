using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EcoPickup.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddPickupRequestPricing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "PriceBase",
                table: "pickup_requests",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PriceCurrency",
                table: "pickup_requests",
                type: "character varying(3)",
                maxLength: 3,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PriceDistanceAdjustment",
                table: "pickup_requests",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PriceFloorAdjustment",
                table: "pickup_requests",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PriceSizeAdjustment",
                table: "pickup_requests",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PriceTotal",
                table: "pickup_requests",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PriceBase",
                table: "pickup_requests");

            migrationBuilder.DropColumn(
                name: "PriceCurrency",
                table: "pickup_requests");

            migrationBuilder.DropColumn(
                name: "PriceDistanceAdjustment",
                table: "pickup_requests");

            migrationBuilder.DropColumn(
                name: "PriceFloorAdjustment",
                table: "pickup_requests");

            migrationBuilder.DropColumn(
                name: "PriceSizeAdjustment",
                table: "pickup_requests");

            migrationBuilder.DropColumn(
                name: "PriceTotal",
                table: "pickup_requests");
        }
    }
}
