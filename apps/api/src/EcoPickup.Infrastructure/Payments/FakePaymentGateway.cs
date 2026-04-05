using EcoPickup.Application.Payments.Abstractions;
using EcoPickup.Application.Payments.Models;
using Microsoft.Extensions.Options;

namespace EcoPickup.Infrastructure.Payments;

public sealed class FakePaymentGateway(IOptions<PaymentOptions> paymentOptions) : IPaymentGateway
{
  private readonly PaymentOptions _paymentOptions = paymentOptions.Value;

  public Task<PaymentSessionResult> CreateSessionAsync(
    CreatePaymentSessionCommand command,
    CancellationToken cancellationToken)
  {
    var providerSessionId = Guid.NewGuid().ToString("N");
    var checkoutUrl = $"{_paymentOptions.CheckoutBaseUrl.TrimEnd('/')}/{providerSessionId}";

    return Task.FromResult(new PaymentSessionResult(
      _paymentOptions.ProviderName,
      providerSessionId,
      checkoutUrl));
  }
}
