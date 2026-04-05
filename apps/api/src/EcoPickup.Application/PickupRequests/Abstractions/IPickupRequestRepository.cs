using EcoPickup.Domain.PickupRequests;

namespace EcoPickup.Application.PickupRequests.Abstractions;

public interface IPickupRequestRepository
{
  Task AddAsync(PickupRequest pickupRequest, CancellationToken cancellationToken);

  Task<IReadOnlyList<PickupRequest>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);

  Task<PickupRequest?> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken);

  Task<IReadOnlyList<PickupRequest>> GetAllAsync(CancellationToken cancellationToken);

  Task<PickupRequest?> GetByIdForAdminAsync(Guid id, CancellationToken cancellationToken);

  Task<PickupRequest?> GetTrackedByIdAsync(Guid id, CancellationToken cancellationToken);

  Task SaveChangesAsync(CancellationToken cancellationToken);
}
