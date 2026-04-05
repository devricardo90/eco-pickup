using EcoPickup.Domain.PickupRequests;

namespace EcoPickup.Application.PickupRequests.Abstractions;

public interface IPickupRequestRepository
{
  Task AddAsync(PickupRequest pickupRequest, CancellationToken cancellationToken);

  Task SaveChangesAsync(CancellationToken cancellationToken);
}
