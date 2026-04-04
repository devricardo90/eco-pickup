using Microsoft.EntityFrameworkCore;

namespace EcoPickup.Infrastructure.Persistence;

public sealed class EcoPickupDbContext(DbContextOptions<EcoPickupDbContext> options)
  : DbContext(options)
{
}
