using EcoPickup.Application.Authentication.Abstractions;
using EcoPickup.Application.Payments.Abstractions;
using EcoPickup.Application.PickupRequests.Abstractions;
using EcoPickup.Application.DependencyInjection;
using EcoPickup.Infrastructure.Authentication;
using EcoPickup.Infrastructure.Payments;
using EcoPickup.Infrastructure.Persistence;
using EcoPickup.Infrastructure.PickupRequests;
using EcoPickup.Infrastructure.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Npgsql;

namespace EcoPickup.Infrastructure.DependencyInjection;

public static class InfrastructureServiceCollectionExtensions
{
  public static IServiceCollection AddInfrastructure(
    this IServiceCollection services,
    IConfiguration configuration,
    IHostEnvironment hostEnvironment)
  {
    services.AddApplication();
    services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));
    services.AddSingleton<IValidateOptions<JwtOptions>, JwtOptionsValidator>();
    services.AddSingleton<IPasswordHashService, Pbkdf2PasswordHashService>();
    services.AddSingleton<IAccessTokenService, JwtAccessTokenService>();
    services.AddScoped<IAuthUserRepository, AuthUserRepository>();
    services.AddScoped<IPaymentRepository, PaymentRepository>();
    services.AddScoped<IPickupRequestRepository, PickupRequestRepository>();
    services.AddScoped<IPickupItemPhotoRepository, PickupRequestRepository>();
    services.Configure<PaymentOptions>(configuration.GetSection(PaymentOptions.SectionName));
    services.AddSingleton<IPaymentGateway, FakePaymentGateway>();
    services.Configure<ObjectStorageOptions>(configuration.GetSection(ObjectStorageOptions.SectionName));
    services.Configure<CloudinaryOptions>(configuration.GetSection(CloudinaryOptions.SectionName));
    services.AddSingleton<IItemPhotoStorage, CloudinaryItemPhotoStorage>();

    var connectionString = configuration.GetConnectionString("Database")
      ?? throw new InvalidOperationException(
        "Connection string 'Database' was not found. Configure ConnectionStrings__Database in the runtime environment.");

    ValidateDatabaseConnectionString(connectionString, hostEnvironment);

    services.AddHostedService(sp =>
      new DatabaseConnectionStartupValidationHostedService(
        connectionString,
        sp.GetRequiredService<ILogger<DatabaseConnectionStartupValidationHostedService>>()));

    services.AddDbContext<EcoPickupDbContext>(options =>
    {
      options.UseNpgsql(connectionString);
    });

    services.AddHealthChecks()
      .AddNpgSql(
        connectionString,
        name: "postgresql",
        failureStatus: HealthStatus.Unhealthy);

    return services;
  }

  private static void ValidateDatabaseConnectionString(
    string connectionString,
    IHostEnvironment hostEnvironment)
  {
    var connectionStringBuilder = new NpgsqlConnectionStringBuilder(connectionString);

    if (hostEnvironment.IsDevelopment())
    {
      return;
    }

    var host = connectionStringBuilder.Host;

    if (string.Equals(host, "localhost", StringComparison.OrdinalIgnoreCase) ||
      string.Equals(host, "127.0.0.1", StringComparison.OrdinalIgnoreCase) ||
      string.Equals(host, "::1", StringComparison.OrdinalIgnoreCase))
    {
      throw new InvalidOperationException(
        "Connection string 'Database' cannot use a localhost host outside Development. Configure ConnectionStrings__Database for the runtime environment.");
    }
  }
}

internal sealed class DatabaseConnectionStartupValidationHostedService(
  string connectionString,
  ILogger<DatabaseConnectionStartupValidationHostedService> logger) : IHostedService
{
  public async Task StartAsync(CancellationToken cancellationToken)
  {
    logger.LogInformation("[DB-CONNECT] Attempting connection...");

    try
    {
      await using var connection = new NpgsqlConnection(connectionString);
      await connection.OpenAsync(cancellationToken);
      logger.LogInformation("[DB-CONNECT] Succeeded");
    }
    catch (Exception ex)
    {
      logger.LogError(ex, "[DB-CONNECT] Failed: {Message}", ex.Message);
    }
  }

  public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
