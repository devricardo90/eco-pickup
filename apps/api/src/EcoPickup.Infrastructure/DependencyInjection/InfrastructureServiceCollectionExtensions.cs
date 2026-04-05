using EcoPickup.Application.Authentication.Abstractions;
using EcoPickup.Application.DependencyInjection;
using EcoPickup.Infrastructure.Authentication;
using EcoPickup.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;

namespace EcoPickup.Infrastructure.DependencyInjection;

public static class InfrastructureServiceCollectionExtensions
{
  public static IServiceCollection AddInfrastructure(
    this IServiceCollection services,
    IConfiguration configuration)
  {
    services.AddApplication();
    services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));
    services.AddSingleton<IValidateOptions<JwtOptions>, JwtOptionsValidator>();
    services.AddSingleton<IPasswordHashService, Pbkdf2PasswordHashService>();
    services.AddSingleton<IAccessTokenService, JwtAccessTokenService>();
    services.AddScoped<IAuthUserRepository, AuthUserRepository>();

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
