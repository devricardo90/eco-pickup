using EcoPickup.Application.Authentication;
using EcoPickup.Application.Authentication.Abstractions;
using EcoPickup.Application.Payments;
using EcoPickup.Application.Payments.Abstractions;
using EcoPickup.Application.PickupRequests;
using EcoPickup.Application.PickupRequests.Abstractions;
using Microsoft.Extensions.DependencyInjection;

namespace EcoPickup.Application.DependencyInjection;

public static class ApplicationServiceCollectionExtensions
{
  public static IServiceCollection AddApplication(this IServiceCollection services)
  {
    services.AddScoped<IAuthService, AuthService>();
    services.AddScoped<IPaymentService, PaymentService>();
    services.AddScoped<IPickupRequestService, PickupRequestService>();
    services.AddScoped<IPickupItemPhotoService, PickupItemPhotoService>();
    return services;
  }
}
