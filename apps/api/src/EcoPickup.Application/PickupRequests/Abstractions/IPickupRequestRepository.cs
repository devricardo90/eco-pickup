using EcoPickup.Domain.PickupRequests;

namespace EcoPickup.Application.PickupRequests.Abstractions;

public interface IPickupRequestRepository
{
  Task AddAsync(PickupRequest pickupRequest, CancellationToken cancellationToken);

  Task<IReadOnlyList<PickupRequest>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);

  Task<PickupRequest?> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken);

  Task SaveChangesAsync(CancellationToken cancellationToken);
}
