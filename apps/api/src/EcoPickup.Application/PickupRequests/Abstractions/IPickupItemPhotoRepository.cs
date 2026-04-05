using EcoPickup.Domain.PickupRequests;

namespace EcoPickup.Application.PickupRequests.Abstractions;

public interface IPickupItemPhotoRepository
{
  Task<PickupItem?> GetOwnedItemByIdAsync(Guid itemId, Guid userId, CancellationToken cancellationToken);

  Task AddPhotoAsync(ItemPhoto photo, CancellationToken cancellationToken);

  Task SaveChangesAsync(CancellationToken cancellationToken);
}
