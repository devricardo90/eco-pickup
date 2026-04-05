using EcoPickup.Domain.PickupRequests;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EcoPickup.Infrastructure.Persistence.Configurations;

public sealed class PickupRequestStatusHistoryConfiguration : IEntityTypeConfiguration<PickupRequestStatusHistory>
{
  public void Configure(EntityTypeBuilder<PickupRequestStatusHistory> builder)
  {
    builder.ToTable("pickup_request_status_history");

    builder.HasKey(x => x.Id);

    builder.Property(x => x.Id)
      .ValueGeneratedNever();

    builder.Property(x => x.PickupRequestId)
      .IsRequired();

    builder.Property(x => x.FromStatus)
      .HasMaxLength(32)
      .IsRequired();

    builder.Property(x => x.ToStatus)
      .HasMaxLength(32)
      .IsRequired();

    builder.Property(x => x.Action)
      .HasMaxLength(16)
      .IsRequired();

    builder.Property(x => x.ActorUserId)
      .IsRequired();

    builder.Property(x => x.Note)
      .HasMaxLength(1000);

    builder.Property(x => x.CreatedUtc)
      .IsRequired();

    builder.HasIndex(x => x.PickupRequestId);
  }
}
