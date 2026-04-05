using EcoPickup.Application.PickupRequests.Models;

namespace EcoPickup.Application.PickupRequests.Abstractions;

public interface IPickupRequestService
{
  Task<PickupRequestResult> CreateAsync(
    Guid userId,
    CreatePickupRequestCommand command,
    CancellationToken cancellationToken);
}
