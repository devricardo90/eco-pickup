using Microsoft.EntityFrameworkCore;
using EcoPickup.Infrastructure.Persistence.Models;

namespace EcoPickup.Infrastructure.Persistence;

public sealed class EcoPickupDbContext(DbContextOptions<EcoPickupDbContext> options)
  : DbContext(options)
{
  public DbSet<PersistenceCheckpoint> PersistenceCheckpoints => Set<PersistenceCheckpoint>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.ApplyConfigurationsFromAssembly(typeof(EcoPickupDbContext).Assembly);
    base.OnModelCreating(modelBuilder);
  }
}
