using EcoPickup.Application.Payments.Abstractions;
using EcoPickup.Domain.PickupRequests;
using EcoPickup.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EcoPickup.Infrastructure.Payments;

public sealed class PaymentRepository(EcoPickupDbContext dbContext) : IPaymentRepository
{
  public Task<PickupRequest?> GetOwnedRequestForPaymentAsync(Guid pickupRequestId, Guid userId, CancellationToken cancellationToken) =>
    dbContext.PickupRequests
      .Include(pickupRequest => pickupRequest.Payments)
      .Include(pickupRequest => pickupRequest.StatusHistory)
      .SingleOrDefaultAsync(
        pickupRequest => pickupRequest.Id == pickupRequestId && pickupRequest.UserId == userId,
        cancellationToken);

  public Task<Payment?> GetByProviderSessionIdAsync(string providerSessionId, CancellationToken cancellationToken) =>
    dbContext.Payments
      .Include(payment => payment.PickupRequest)
      .ThenInclude(pickupRequest => pickupRequest.StatusHistory)
      .SingleOrDefaultAsync(payment => payment.ProviderSessionId == providerSessionId, cancellationToken);

  public Task AddAsync(Payment payment, CancellationToken cancellationToken) =>
    dbContext.Payments.AddAsync(payment, cancellationToken).AsTask();

  public Task SaveChangesAsync(CancellationToken cancellationToken) =>
    dbContext.SaveChangesAsync(cancellationToken);
}
