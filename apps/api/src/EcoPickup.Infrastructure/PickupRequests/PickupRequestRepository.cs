using EcoPickup.Application.PickupRequests.Abstractions;
using EcoPickup.Domain.PickupRequests;
using EcoPickup.Infrastructure.Persistence;

namespace EcoPickup.Infrastructure.PickupRequests;

public sealed class PickupRequestRepository(EcoPickupDbContext dbContext) : IPickupRequestRepository
{
  public Task AddAsync(PickupRequest pickupRequest, CancellationToken cancellationToken) =>
    dbContext.PickupRequests.AddAsync(pickupRequest, cancellationToken).AsTask();

  public Task SaveChangesAsync(CancellationToken cancellationToken) =>
    dbContext.SaveChangesAsync(cancellationToken);
}
