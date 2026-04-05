using EcoPickup.Application.PickupRequests.Models;

namespace EcoPickup.Application.PickupRequests.Abstractions;

public interface IPickupRequestService
{
  Task<PickupRequestResult> CreateAsync(
    Guid userId,
    CreatePickupRequestCommand command,
    CancellationToken cancellationToken);

  Task<IReadOnlyList<PickupRequestResult>> GetByUserAsync(
    Guid userId,
    CancellationToken cancellationToken);

  Task<PickupRequestResult?> GetByIdAsync(
    Guid id,
    Guid userId,
    CancellationToken cancellationToken);
}
