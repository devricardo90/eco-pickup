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
using Microsoft.Extensions.Options;
using Npgsql;

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
    services.AddScoped<IPaymentRepository, PaymentRepository>();
    services.AddScoped<IPickupRequestRepository, PickupRequestRepository>();
    services.AddScoped<IPickupItemPhotoRepository, PickupRequestRepository>();
    services.Configure<PaymentOptions>(configuration.GetSection(PaymentOptions.SectionName));
    services.AddSingleton<IPaymentGateway, FakePaymentGateway>();
    services.Configure<ObjectStorageOptions>(configuration.GetSection(ObjectStorageOptions.SectionName));
    services.AddSingleton<IItemPhotoStorage, S3ItemPhotoStorage>();

    var connectionString = configuration.GetConnectionString("Database")
      ?? throw new InvalidOperationException(
        "Connection string 'Database' was not found. Configure ConnectionStrings__Database in the runtime environment.");

    var connectionStringBuilder = new NpgsqlConnectionStringBuilder(connectionString);
    var trustServerCertificate = connectionStringBuilder.TryGetValue(
      "Trust Server Certificate",
      out var trustServerCertificateValue)
        ? trustServerCertificateValue
        : null;

    Console.WriteLine(
      $"[DB-CONFIG] Host={connectionStringBuilder.Host}; Port={connectionStringBuilder.Port}; Database={connectionStringBuilder.Database}; SslMode={connectionStringBuilder.SslMode}; TrustServerCertificate={trustServerCertificate}");

    services.AddDbContext<EcoPickupDbContext>(options =>
    {
      options.UseNpgsql(connectionString);
    });

    services.AddHealthChecks()
      .AddDbContextCheck<EcoPickupDbContext>(
        name: "postgresql",
        failureStatus: HealthStatus.Unhealthy);

    return services;
  }
}
