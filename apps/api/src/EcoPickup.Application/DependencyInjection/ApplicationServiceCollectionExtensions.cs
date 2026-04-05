using EcoPickup.Application.Authentication;
using EcoPickup.Application.Authentication.Abstractions;
using Microsoft.Extensions.DependencyInjection;

namespace EcoPickup.Application.DependencyInjection;

public static class ApplicationServiceCollectionExtensions
{
  public static IServiceCollection AddApplication(this IServiceCollection services)
  {
    services.AddScoped<IAuthService, AuthService>();
    return services;
  }
}
