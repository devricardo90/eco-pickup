using EcoPickup.Application.Payments.Models;

namespace EcoPickup.Application.Payments.Abstractions;

public interface IPaymentService
{
  Task<PaymentResult> CreateSessionAsync(
    Guid pickupRequestId,
    Guid userId,
    CancellationToken cancellationToken);

  Task<PaymentResult?> ConfirmAsync(
    ConfirmPaymentCommand command,
    CancellationToken cancellationToken);
}
