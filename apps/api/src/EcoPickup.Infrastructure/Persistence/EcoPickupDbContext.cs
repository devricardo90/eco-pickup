using EcoPickup.Domain.Identity;
using EcoPickup.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace EcoPickup.Infrastructure.Persistence;

public sealed class EcoPickupDbContext(DbContextOptions<EcoPickupDbContext> options)
  : DbContext(options)
{
  public DbSet<AuthUser> AuthUsers => Set<AuthUser>();

  public DbSet<PersistenceCheckpoint> PersistenceCheckpoints => Set<PersistenceCheckpoint>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.ApplyConfigurationsFromAssembly(typeof(EcoPickupDbContext).Assembly);
    base.OnModelCreating(modelBuilder);
  }
}
