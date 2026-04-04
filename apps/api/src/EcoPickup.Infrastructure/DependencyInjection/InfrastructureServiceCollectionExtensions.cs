using EcoPickup.Application.DependencyInjection;
using EcoPickup.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace EcoPickup.Infrastructure.DependencyInjection;

public static class InfrastructureServiceCollectionExtensions
{
  public static IServiceCollection AddInfrastructure(
    this IServiceCollection services,
    IConfiguration configuration)
  {
    services.AddApplication();

    var connectionString = configuration.GetConnectionString("Database");

    services.AddDbContext<EcoPickupDbContext>(options =>
    {
      if (!string.IsNullOrWhiteSpace(connectionString))
      {
        options.UseNpgsql(connectionString);
      }
    });

    if (!string.IsNullOrWhiteSpace(connectionString))
    {
      services.AddHealthChecks()
        .AddDbContextCheck<EcoPickupDbContext>(
          name: "postgresql",
          failureStatus: HealthStatus.Unhealthy);
    }

    return services;
  }
}
