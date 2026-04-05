using EcoPickup.Application.PickupRequests;
using EcoPickup.Application.PickupRequests.Abstractions;
using EcoPickup.Application.PickupRequests.Exceptions;
using EcoPickup.Application.PickupRequests.Models;
using EcoPickup.Domain.PickupRequests;
using Xunit;

namespace EcoPickup.UnitTests.PickupRequests;

public sealed class PickupItemPhotoServiceTests
{
  [Fact]
  public async Task UploadAsync_ShouldPersistPhotoMetadataAndStoreObject()
  {
    var ownerId = Guid.NewGuid();
    var repository = new InMemoryPickupItemPhotoRepository(CreatePickupItem(ownerId));
    var storage = new InMemoryItemPhotoStorage();
    var service = new PickupItemPhotoService(repository, storage);
    var itemId = repository.StoredItems[0].Id;

    var result = await service.UploadAsync(
      itemId,
      ownerId,
      new UploadPickupItemPhotoCommand(
        "table-front.jpg",
        "image/jpeg",
        CreateJpegBytes()),
      CancellationToken.None);

    Assert.NotNull(result);
    Assert.Single(storage.SavedObjects);
    Assert.Single(repository.StoredPhotos);
    Assert.Equal(itemId, repository.StoredPhotos[0].PickupItemId);
    Assert.Contains($"/items/{itemId}/photos/", repository.StoredPhotos[0].StorageKey);
    Assert.Equal("table-front.jpg", repository.StoredPhotos[0].OriginalFileName);
  }

  [Fact]
  public async Task UploadAsync_ShouldReturnNullWhenItemDoesNotBelongToAuthenticatedUser()
  {
    var repository = new InMemoryPickupItemPhotoRepository(CreatePickupItem(Guid.NewGuid()));
    var storage = new InMemoryItemPhotoStorage();
    var service = new PickupItemPhotoService(repository, storage);

    var result = await service.UploadAsync(
      repository.StoredItems[0].Id,
      Guid.NewGuid(),
      new UploadPickupItemPhotoCommand(
        "table-front.jpg",
        "image/jpeg",
        CreateJpegBytes()),
      CancellationToken.None);

    Assert.Null(result);
    Assert.Empty(storage.SavedObjects);
    Assert.Empty(repository.StoredPhotos);
  }

  [Fact]
  public async Task UploadAsync_ShouldThrowWhenItemAlreadyHasFivePhotos()
  {
    var ownerId = Guid.NewGuid();
    var item = CreatePickupItem(ownerId);
    item.Photos =
    [
      CreatePhoto(item.Id),
      CreatePhoto(item.Id),
      CreatePhoto(item.Id),
      CreatePhoto(item.Id),
      CreatePhoto(item.Id)
    ];

    var repository = new InMemoryPickupItemPhotoRepository(item);
    var storage = new InMemoryItemPhotoStorage();
    var service = new PickupItemPhotoService(repository, storage);

    await Assert.ThrowsAsync<PickupRequestValidationException>(() =>
      service.UploadAsync(
        item.Id,
        ownerId,
        new UploadPickupItemPhotoCommand(
          "table-front.jpg",
          "image/jpeg",
          CreateJpegBytes()),
        CancellationToken.None));
  }

  [Fact]
  public async Task UploadAsync_ShouldThrowWhenDeclaredTypeDoesNotMatchFileSignature()
  {
    var ownerId = Guid.NewGuid();
    var repository = new InMemoryPickupItemPhotoRepository(CreatePickupItem(ownerId));
    var storage = new InMemoryItemPhotoStorage();
    var service = new PickupItemPhotoService(repository, storage);

    await Assert.ThrowsAsync<PickupRequestValidationException>(() =>
      service.UploadAsync(
        repository.StoredItems[0].Id,
        ownerId,
        new UploadPickupItemPhotoCommand(
          "table-front.png",
          "image/png",
          CreateJpegBytes()),
        CancellationToken.None));
  }

  private static PickupItem CreatePickupItem(Guid ownerId)
  {
    var pickupRequestId = Guid.NewGuid();

    return new PickupItem
    {
      Id = Guid.NewGuid(),
      PickupRequestId = pickupRequestId,
      Category = "furniture",
      Description = "Wood dining table",
      EstimatedSize = PickupItemSizes.Medium,
      CreatedUtc = DateTime.UtcNow,
      PickupRequest = new PickupRequest
      {
        Id = pickupRequestId,
        UserId = ownerId,
        Description = "Dining table pickup",
        Status = PickupRequestStatuses.Draft,
        PickupWindowStartUtc = DateTime.UtcNow.AddDays(1),
        PickupWindowEndUtc = DateTime.UtcNow.AddDays(1).AddHours(2),
        CreatedUtc = DateTime.UtcNow,
        Address = new Address
        {
          Id = Guid.NewGuid(),
          PickupRequestId = pickupRequestId,
          Street = "Examplegatan 10",
          City = "Stockholm",
          PostalCode = "11355",
          HasElevator = false
        }
      }
    };
  }

  private static ItemPhoto CreatePhoto(Guid pickupItemId) =>
    new()
    {
      Id = Guid.NewGuid(),
      PickupItemId = pickupItemId,
      StorageKey = $"pickup-requests/request/items/{pickupItemId}/photos/{Guid.NewGuid()}.jpg",
      OriginalFileName = "existing.jpg",
      ContentType = "image/jpeg",
      SizeBytes = 128,
      CreatedUtc = DateTime.UtcNow
    };

  private static byte[] CreateJpegBytes() => [0xFF, 0xD8, 0xFF, 0xEE, 0x00, 0x10];

  private sealed class InMemoryPickupItemPhotoRepository(params PickupItem[] items) : IPickupItemPhotoRepository
  {
    public List<PickupItem> StoredItems { get; } = items.ToList();

    public List<ItemPhoto> StoredPhotos { get; } = items.SelectMany(item => item.Photos).ToList();

    public Task<PickupItem?> GetOwnedItemByIdAsync(Guid itemId, Guid userId, CancellationToken cancellationToken) =>
      Task.FromResult(
        StoredItems.SingleOrDefault(item => item.Id == itemId && item.PickupRequest.UserId == userId));

    public Task AddPhotoAsync(ItemPhoto photo, CancellationToken cancellationToken)
    {
      StoredPhotos.Add(photo);
      StoredItems.Single(item => item.Id == photo.PickupItemId).Photos.Add(photo);
      return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken) => Task.CompletedTask;
  }

  private sealed class InMemoryItemPhotoStorage : IItemPhotoStorage
  {
    public List<(string Key, string ContentType, byte[] Content)> SavedObjects { get; } = [];

    public List<string> DeletedKeys { get; } = [];

    public Task SaveAsync(string key, string contentType, byte[] content, CancellationToken cancellationToken)
    {
      SavedObjects.Add((key, contentType, content));
      return Task.CompletedTask;
    }

    public Task DeleteAsync(string key, CancellationToken cancellationToken)
    {
      DeletedKeys.Add(key);
      return Task.CompletedTask;
    }
  }
}
