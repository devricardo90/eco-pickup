using EcoPickup.Application.PickupRequests.Models;

namespace EcoPickup.Application.PickupRequests.Abstractions;

public interface IPickupItemPhotoService
{
  Task<PickupItemPhotoResult?> UploadAsync(
    Guid itemId,
    Guid userId,
    UploadPickupItemPhotoCommand command,
    CancellationToken cancellationToken);
}
