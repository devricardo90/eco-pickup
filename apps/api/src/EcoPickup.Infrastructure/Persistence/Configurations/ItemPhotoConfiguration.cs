using EcoPickup.Domain.PickupRequests;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EcoPickup.Infrastructure.Persistence.Configurations;

public sealed class ItemPhotoConfiguration : IEntityTypeConfiguration<ItemPhoto>
{
  public void Configure(EntityTypeBuilder<ItemPhoto> builder)
  {
    builder.ToTable("item_photos");

    builder.HasKey(x => x.Id);

    builder.Property(x => x.Id)
      .ValueGeneratedNever();

    builder.Property(x => x.PickupItemId)
      .IsRequired();

    builder.Property(x => x.StorageKey)
      .HasMaxLength(512)
      .IsRequired();

    builder.Property(x => x.OriginalFileName)
      .HasMaxLength(255)
      .IsRequired();

    builder.Property(x => x.ContentType)
      .HasMaxLength(64)
      .IsRequired();

    builder.Property(x => x.SizeBytes)
      .IsRequired();

    builder.Property(x => x.CreatedUtc)
      .IsRequired();

    builder.HasIndex(x => x.PickupItemId);
  }
}
