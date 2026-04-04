using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace EcoPickup.Infrastructure.Persistence;

public sealed class EcoPickupDbContextFactory : IDesignTimeDbContextFactory<EcoPickupDbContext>
{
  public EcoPickupDbContext CreateDbContext(string[] args)
  {
    var basePath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "EcoPickup.Api"));

    var configuration = new ConfigurationBuilder()
      .SetBasePath(basePath)
      .AddJsonFile("appsettings.json", optional: false)
      .AddJsonFile("appsettings.Development.json", optional: true)
      .AddEnvironmentVariables()
      .Build();

    var connectionString = configuration.GetConnectionString("Database")
      ?? throw new InvalidOperationException("Connection string 'Database' was not found.");

    var optionsBuilder = new DbContextOptionsBuilder<EcoPickupDbContext>();
    optionsBuilder.UseNpgsql(connectionString);

    return new EcoPickupDbContext(optionsBuilder.Options);
  }
}
