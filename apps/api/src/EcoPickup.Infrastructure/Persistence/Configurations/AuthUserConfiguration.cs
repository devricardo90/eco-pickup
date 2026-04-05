using EcoPickup.Domain.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EcoPickup.Infrastructure.Persistence.Configurations;

public sealed class AuthUserConfiguration : IEntityTypeConfiguration<AuthUser>
{
  public void Configure(EntityTypeBuilder<AuthUser> builder)
  {
    builder.ToTable("auth_users");

    builder.HasKey(x => x.Id);

    builder.HasIndex(x => x.Email)
      .IsUnique();

    builder.Property(x => x.Id)
      .ValueGeneratedNever();

    builder.Property(x => x.Email)
      .HasMaxLength(320)
      .IsRequired();

    builder.Property(x => x.PasswordHash)
      .HasMaxLength(512)
      .IsRequired();

    builder.Property(x => x.Role)
      .HasMaxLength(16)
      .IsRequired();

    builder.Property(x => x.CreatedUtc)
      .IsRequired();
  }
}
