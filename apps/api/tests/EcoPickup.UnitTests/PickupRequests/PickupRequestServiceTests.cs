using EcoPickup.Application.PickupRequests;
using EcoPickup.Application.PickupRequests.Abstractions;
using EcoPickup.Application.PickupRequests.Exceptions;
using EcoPickup.Application.PickupRequests.Models;
using EcoPickup.Domain.PickupRequests;
using Xunit;

namespace EcoPickup.UnitTests.PickupRequests;

public sealed class PickupRequestServiceTests
{
  [Fact]
  public async Task CreateAsync_ShouldPersistDraftRequestForAuthenticatedUser()
  {
    var repository = new InMemoryPickupRequestRepository();
    var service = new PickupRequestService(repository);
    var userId = Guid.NewGuid();

    var pickupRequest = await service.CreateAsync(
      userId,
      new CreatePickupRequestCommand(
        "Two-seat sofa",
        DateTime.UtcNow.AddDays(2),
        DateTime.UtcNow.AddDays(2).AddHours(3),
        new CreatePickupRequestAddressCommand(
          "Main Street 1",
          "Stockholm",
          "11122",
          "3",
          false,
          "Ring bell 21"),
        [
          new CreatePickupItemCommand("furniture", "Two-seat sofa", "large")
        ]),
      CancellationToken.None);

    Assert.Equal(userId, pickupRequest.UserId);
    Assert.Equal(PickupRequestStatuses.Draft, pickupRequest.Status);
    Assert.Equal("Stockholm", pickupRequest.Address.City);
    Assert.Single(pickupRequest.Items);
    Assert.Equal("furniture", pickupRequest.Items[0].Category);
    Assert.Single(repository.StoredPickupRequests);
  }

  [Fact]
  public async Task CreateAsync_ShouldThrowWhenPickupWindowEndIsNotAfterStart()
  {
    var repository = new InMemoryPickupRequestRepository();
    var service = new PickupRequestService(repository);
    var pickupWindowStartUtc = DateTime.UtcNow.AddDays(1);

    await Assert.ThrowsAsync<PickupRequestValidationException>(() =>
      service.CreateAsync(
        Guid.NewGuid(),
        new CreatePickupRequestCommand(
          "Wardrobe",
          pickupWindowStartUtc,
          pickupWindowStartUtc,
          new CreatePickupRequestAddressCommand(
            "Main Street 1",
            "Stockholm",
            "11122",
            null,
            true,
            null),
          [
            new CreatePickupItemCommand("furniture", "Wardrobe", "large")
          ]),
        CancellationToken.None));
  }

  [Fact]
  public async Task CreateAsync_ShouldThrowWhenItemsAreMissing()
  {
    var repository = new InMemoryPickupRequestRepository();
    var service = new PickupRequestService(repository);

    await Assert.ThrowsAsync<PickupRequestValidationException>(() =>
      service.CreateAsync(
        Guid.NewGuid(),
        new CreatePickupRequestCommand(
          "Wardrobe",
          DateTime.UtcNow.AddDays(1),
          DateTime.UtcNow.AddDays(1).AddHours(2),
          new CreatePickupRequestAddressCommand(
            "Main Street 1",
            "Stockholm",
            "11122",
            null,
            true,
            null),
          []),
        CancellationToken.None));
  }

  [Fact]
  public async Task CreateAsync_ShouldThrowWhenItemEstimatedSizeIsInvalid()
  {
    var repository = new InMemoryPickupRequestRepository();
    var service = new PickupRequestService(repository);

    await Assert.ThrowsAsync<PickupRequestValidationException>(() =>
      service.CreateAsync(
        Guid.NewGuid(),
        new CreatePickupRequestCommand(
          "Wardrobe",
          DateTime.UtcNow.AddDays(1),
          DateTime.UtcNow.AddDays(1).AddHours(2),
          new CreatePickupRequestAddressCommand(
            "Main Street 1",
            "Stockholm",
            "11122",
            null,
            true,
            null),
          [
            new CreatePickupItemCommand("furniture", "Wardrobe", "oversized")
          ]),
        CancellationToken.None));
  }

  [Fact]
  public async Task GetByUserAsync_ShouldReturnOnlyAuthenticatedUserRequests()
  {
    var repository = new InMemoryPickupRequestRepository();
    var userId = Guid.NewGuid();
    repository.StoredPickupRequests.AddRange(
    [
      CreatePickupRequest(userId, "Sofa", DateTime.UtcNow.AddMinutes(-10)),
      CreatePickupRequest(Guid.NewGuid(), "Wardrobe", DateTime.UtcNow.AddMinutes(-5))
    ]);

    var service = new PickupRequestService(repository);

    var pickupRequests = await service.GetByUserAsync(userId, CancellationToken.None);

    Assert.Single(pickupRequests);
    Assert.Equal(userId, pickupRequests[0].UserId);
    Assert.Equal("Sofa", pickupRequests[0].Description);
    Assert.Single(pickupRequests[0].Items);
  }

  [Fact]
  public async Task GetAllForAdminAsync_ShouldReturnAllRequestsOrderedByCreatedUtcDescending()
  {
    var repository = new InMemoryPickupRequestRepository();
    var olderRequest = CreatePickupRequest(Guid.NewGuid(), "Sofa", DateTime.UtcNow.AddMinutes(-20));
    var newerRequest = CreatePickupRequest(Guid.NewGuid(), "Refrigerator", DateTime.UtcNow.AddMinutes(-5));
    repository.StoredPickupRequests.AddRange([olderRequest, newerRequest]);

    var service = new PickupRequestService(repository);

    var pickupRequests = await service.GetAllForAdminAsync(CancellationToken.None);

    Assert.Equal(2, pickupRequests.Count);
    Assert.Equal(newerRequest.Id, pickupRequests[0].Id);
    Assert.Equal(olderRequest.Id, pickupRequests[1].Id);
  }

  [Fact]
  public async Task GetByIdAsync_ShouldReturnNullWhenRequestDoesNotBelongToAuthenticatedUser()
  {
    var repository = new InMemoryPickupRequestRepository();
    var ownerId = Guid.NewGuid();
    var otherUserId = Guid.NewGuid();
    var pickupRequest = CreatePickupRequest(ownerId, "Desk", DateTime.UtcNow.AddMinutes(-15));
    repository.StoredPickupRequests.Add(pickupRequest);

    var service = new PickupRequestService(repository);

    var result = await service.GetByIdAsync(pickupRequest.Id, otherUserId, CancellationToken.None);

    Assert.Null(result);
  }

  [Fact]
  public async Task GetByIdAsync_ShouldIncludeItemPhotosInRequestDetail()
  {
    var repository = new InMemoryPickupRequestRepository();
    var ownerId = Guid.NewGuid();
    var pickupRequest = CreatePickupRequest(ownerId, "Dining table", DateTime.UtcNow.AddMinutes(-15));
    pickupRequest.Items[0].Photos.Add(
      new ItemPhoto
      {
        Id = Guid.NewGuid(),
        PickupItemId = pickupRequest.Items[0].Id,
        StorageKey = "pickup-requests/request/items/item/photos/photo.jpg",
        OriginalFileName = "photo.jpg",
        ContentType = "image/jpeg",
        SizeBytes = 512,
        CreatedUtc = DateTime.UtcNow
      });
    repository.StoredPickupRequests.Add(pickupRequest);

    var service = new PickupRequestService(repository);

    var result = await service.GetByIdAsync(pickupRequest.Id, ownerId, CancellationToken.None);

    Assert.NotNull(result);
    Assert.Single(result.Items[0].Photos);
    Assert.Equal("photo.jpg", result.Items[0].Photos[0].OriginalFileName);
  }

  [Fact]
  public async Task GetByIdForAdminAsync_ShouldReturnRequestDetailWithPhotosRegardlessOfOwner()
  {
    var repository = new InMemoryPickupRequestRepository();
    var pickupRequest = CreatePickupRequest(Guid.NewGuid(), "Dining table", DateTime.UtcNow.AddMinutes(-15));
    pickupRequest.Items[0].Photos.Add(
      new ItemPhoto
      {
        Id = Guid.NewGuid(),
        PickupItemId = pickupRequest.Items[0].Id,
        StorageKey = "pickup-requests/request/items/item/photos/photo.jpg",
        OriginalFileName = "photo.jpg",
        ContentType = "image/jpeg",
        SizeBytes = 512,
        CreatedUtc = DateTime.UtcNow
      });
    repository.StoredPickupRequests.Add(pickupRequest);

    var service = new PickupRequestService(repository);

    var result = await service.GetByIdForAdminAsync(pickupRequest.Id, CancellationToken.None);

    Assert.NotNull(result);
    Assert.Equal(pickupRequest.Status, result.Status);
    Assert.Single(result.Items);
    Assert.Single(result.Items[0].Photos);
  }

  private sealed class InMemoryPickupRequestRepository : IPickupRequestRepository
  {
    public List<PickupRequest> StoredPickupRequests { get; } = [];

    public Task AddAsync(PickupRequest pickupRequest, CancellationToken cancellationToken)
    {
      StoredPickupRequests.Add(pickupRequest);
      return Task.CompletedTask;
    }

    public Task<IReadOnlyList<PickupRequest>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken) =>
      Task.FromResult<IReadOnlyList<PickupRequest>>(StoredPickupRequests
        .Where(x => x.UserId == userId)
        .OrderByDescending(x => x.CreatedUtc)
        .ToList());

    public Task<PickupRequest?> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken) =>
      Task.FromResult(StoredPickupRequests.SingleOrDefault(x => x.Id == id && x.UserId == userId));

    public Task<IReadOnlyList<PickupRequest>> GetAllAsync(CancellationToken cancellationToken) =>
      Task.FromResult<IReadOnlyList<PickupRequest>>(StoredPickupRequests
        .OrderByDescending(x => x.CreatedUtc)
        .ToList());

    public Task<PickupRequest?> GetByIdForAdminAsync(Guid id, CancellationToken cancellationToken) =>
      Task.FromResult(StoredPickupRequests.SingleOrDefault(x => x.Id == id));

    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
      Task.CompletedTask;
  }

  private static PickupRequest CreatePickupRequest(Guid userId, string description, DateTime createdUtc)
  {
    var pickupRequestId = Guid.NewGuid();

    return new PickupRequest
    {
      Id = pickupRequestId,
      UserId = userId,
      Description = description,
      Status = PickupRequestStatuses.Draft,
      PickupWindowStartUtc = DateTime.UtcNow.AddDays(1),
      PickupWindowEndUtc = DateTime.UtcNow.AddDays(1).AddHours(2),
      CreatedUtc = createdUtc,
      Address = new Address
      {
        Id = Guid.NewGuid(),
        PickupRequestId = pickupRequestId,
        Street = "Main Street 1",
        City = "Stockholm",
        PostalCode = "11122",
        HasElevator = true
      },
      Items =
      [
        new PickupItem
        {
          Id = Guid.NewGuid(),
          PickupRequestId = pickupRequestId,
          Category = "furniture",
          Description = description,
          EstimatedSize = PickupItemSizes.Medium,
          CreatedUtc = createdUtc.AddMinutes(1)
        }
      ]
    };
  }
}
