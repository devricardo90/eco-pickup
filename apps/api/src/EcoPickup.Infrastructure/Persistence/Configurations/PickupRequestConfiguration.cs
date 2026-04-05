using EcoPickup.Domain.Identity;
using EcoPickup.Domain.PickupRequests;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EcoPickup.Infrastructure.Persistence.Configurations;

public sealed class PickupRequestConfiguration : IEntityTypeConfiguration<PickupRequest>
{
  public void Configure(EntityTypeBuilder<PickupRequest> builder)
  {
    builder.ToTable("pickup_requests");

    builder.HasKey(x => x.Id);

    builder.Property(x => x.Id)
      .ValueGeneratedNever();

    builder.Property(x => x.UserId)
      .IsRequired();

    builder.Property(x => x.Description)
      .HasMaxLength(2000)
      .IsRequired();

    builder.Property(x => x.PickupWindowStartUtc)
      .IsRequired();

    builder.Property(x => x.PickupWindowEndUtc)
      .IsRequired();

    builder.Property(x => x.Status)
      .HasMaxLength(32)
      .IsRequired();

    builder.Property(x => x.PriceBase)
      .HasPrecision(18, 2);

    builder.Property(x => x.PriceSizeAdjustment)
      .HasPrecision(18, 2);

    builder.Property(x => x.PriceFloorAdjustment)
      .HasPrecision(18, 2);

    builder.Property(x => x.PriceDistanceAdjustment)
      .HasPrecision(18, 2);

    builder.Property(x => x.PriceTotal)
      .HasPrecision(18, 2);

    builder.Property(x => x.PriceCurrency)
      .HasMaxLength(3);

    builder.Property(x => x.CreatedUtc)
      .IsRequired();

    builder.HasOne(x => x.Address)
      .WithOne(x => x.PickupRequest)
      .HasForeignKey<Address>(x => x.PickupRequestId)
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasMany(x => x.Items)
      .WithOne(x => x.PickupRequest)
      .HasForeignKey(x => x.PickupRequestId)
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasMany(x => x.StatusHistory)
      .WithOne(x => x.PickupRequest)
      .HasForeignKey(x => x.PickupRequestId)
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasOne<AuthUser>()
      .WithMany()
      .HasForeignKey(x => x.UserId)
      .OnDelete(DeleteBehavior.Restrict);
  }
}
