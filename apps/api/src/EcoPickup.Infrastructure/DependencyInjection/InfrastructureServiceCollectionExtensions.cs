using EcoPickup.Application.DependencyInjection;
using EcoPickup.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

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

    return services;
  }
}
