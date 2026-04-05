using EcoPickup.Domain.PickupRequests;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EcoPickup.Infrastructure.Persistence.Configurations;

public sealed class AddressConfiguration : IEntityTypeConfiguration<Address>
{
  public void Configure(EntityTypeBuilder<Address> builder)
  {
    builder.ToTable("addresses");

    builder.HasKey(x => x.Id);

    builder.Property(x => x.Id)
      .ValueGeneratedNever();

    builder.Property(x => x.PickupRequestId)
      .IsRequired();

    builder.Property(x => x.Street)
      .HasMaxLength(256)
      .IsRequired();

    builder.Property(x => x.City)
      .HasMaxLength(128)
      .IsRequired();

    builder.Property(x => x.PostalCode)
      .HasMaxLength(32)
      .IsRequired();

    builder.Property(x => x.Floor)
      .HasMaxLength(32);

    builder.Property(x => x.AccessNotes)
      .HasMaxLength(512);

    builder.HasIndex(x => x.PickupRequestId)
      .IsUnique();
  }
}
