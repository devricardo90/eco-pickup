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

  private sealed class InMemoryPickupRequestRepository : IPickupRequestRepository
  {
    public List<PickupRequest> StoredPickupRequests { get; } = [];

    public Task AddAsync(PickupRequest pickupRequest, CancellationToken cancellationToken)
    {
      StoredPickupRequests.Add(pickupRequest);
      return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
      Task.CompletedTask;
  }
}
