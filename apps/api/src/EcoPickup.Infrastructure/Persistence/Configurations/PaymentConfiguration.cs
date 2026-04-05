using EcoPickup.Domain.PickupRequests;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EcoPickup.Infrastructure.Persistence.Configurations;

public sealed class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
  public void Configure(EntityTypeBuilder<Payment> builder)
  {
    builder.ToTable("payments");

    builder.HasKey(x => x.Id);

    builder.Property(x => x.Id)
      .ValueGeneratedNever();

    builder.Property(x => x.PickupRequestId)
      .IsRequired();

    builder.Property(x => x.Provider)
      .HasMaxLength(64)
      .IsRequired();

    builder.Property(x => x.ProviderSessionId)
      .HasMaxLength(128)
      .IsRequired();

    builder.Property(x => x.CheckoutUrl)
      .HasMaxLength(512)
      .IsRequired();

    builder.Property(x => x.Amount)
      .HasPrecision(18, 2)
      .IsRequired();

    builder.Property(x => x.Currency)
      .HasMaxLength(3)
      .IsRequired();

    builder.Property(x => x.Status)
      .HasMaxLength(32)
      .IsRequired();

    builder.Property(x => x.ProviderPaymentId)
      .HasMaxLength(128);

    builder.Property(x => x.FailureReason)
      .HasMaxLength(512);

    builder.Property(x => x.CreatedUtc)
      .IsRequired();

    builder.Property(x => x.UpdatedUtc)
      .IsRequired();

    builder.Property(x => x.ConfirmedUtc);

    builder.HasIndex(x => x.PickupRequestId);

    builder.HasIndex(x => x.ProviderSessionId)
      .IsUnique();
  }
}
