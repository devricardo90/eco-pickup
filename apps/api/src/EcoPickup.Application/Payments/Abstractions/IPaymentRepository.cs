using EcoPickup.Domain.PickupRequests;

namespace EcoPickup.Application.Payments.Abstractions;

public interface IPaymentRepository
{
  Task<PickupRequest?> GetOwnedRequestForPaymentAsync(Guid pickupRequestId, Guid userId, CancellationToken cancellationToken);

  Task<Payment?> GetByProviderSessionIdAsync(string providerSessionId, CancellationToken cancellationToken);

  Task AddAsync(Payment payment, CancellationToken cancellationToken);

  Task SaveChangesAsync(CancellationToken cancellationToken);
}
