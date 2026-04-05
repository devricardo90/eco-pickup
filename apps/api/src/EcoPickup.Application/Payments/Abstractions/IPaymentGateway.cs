using EcoPickup.Application.Payments.Models;

namespace EcoPickup.Application.Payments.Abstractions;

public interface IPaymentGateway
{
  Task<PaymentSessionResult> CreateSessionAsync(
    CreatePaymentSessionCommand command,
    CancellationToken cancellationToken);
}
