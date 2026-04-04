using EcoPickup.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EcoPickup.Infrastructure.Persistence.Configurations;

public sealed class PersistenceCheckpointConfiguration : IEntityTypeConfiguration<PersistenceCheckpoint>
{
  public void Configure(EntityTypeBuilder<PersistenceCheckpoint> builder)
  {
    builder.ToTable("persistence_checkpoints");

    builder.HasKey(x => x.Id);

    builder.Property(x => x.Id)
      .ValueGeneratedNever();

    builder.Property(x => x.Name)
      .HasMaxLength(120)
      .IsRequired();

    builder.Property(x => x.CreatedUtc)
      .IsRequired();
  }
}
