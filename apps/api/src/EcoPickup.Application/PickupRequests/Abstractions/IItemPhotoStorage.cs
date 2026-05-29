namespace EcoPickup.Application.PickupRequests.Abstractions;

public interface IItemPhotoStorage
{
  Task<string> SaveAsync(string key, string contentType, byte[] content, CancellationToken cancellationToken);

  Task DeleteAsync(string key, CancellationToken cancellationToken);
}
