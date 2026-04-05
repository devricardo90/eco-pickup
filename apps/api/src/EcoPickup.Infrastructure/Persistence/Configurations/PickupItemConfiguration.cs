using EcoPickup.Domain.PickupRequests;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EcoPickup.Infrastructure.Persistence.Configurations;

public sealed class PickupItemConfiguration : IEntityTypeConfiguration<PickupItem>
{
  public void Configure(EntityTypeBuilder<PickupItem> builder)
  {
    builder.ToTable("pickup_items");

    builder.HasKey(x => x.Id);

    builder.Property(x => x.Id)
      .ValueGeneratedNever();

    builder.Property(x => x.PickupRequestId)
      .IsRequired();

    builder.Property(x => x.Category)
      .HasMaxLength(128)
      .IsRequired();

    builder.Property(x => x.Description)
      .HasMaxLength(2000)
      .IsRequired();

    builder.Property(x => x.EstimatedSize)
      .HasMaxLength(16)
      .IsRequired();

    builder.Property(x => x.CreatedUtc)
      .IsRequired();
  }
}
