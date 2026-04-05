using EcoPickup.Application.PickupRequests.Abstractions;
using EcoPickup.Domain.PickupRequests;
using EcoPickup.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EcoPickup.Infrastructure.PickupRequests;

public sealed class PickupRequestRepository(EcoPickupDbContext dbContext) : IPickupRequestRepository, IPickupItemPhotoRepository
{
  public Task AddAsync(PickupRequest pickupRequest, CancellationToken cancellationToken) =>
    dbContext.PickupRequests.AddAsync(pickupRequest, cancellationToken).AsTask();

  public async Task<IReadOnlyList<PickupRequest>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken) =>
    await dbContext.PickupRequests
      .AsNoTracking()
      .AsSplitQuery()
      .Include(pickupRequest => pickupRequest.Address)
      .Include(pickupRequest => pickupRequest.Items)
      .ThenInclude(item => item.Photos)
      .Where(pickupRequest => pickupRequest.UserId == userId)
      .OrderByDescending(pickupRequest => pickupRequest.CreatedUtc)
      .ToListAsync(cancellationToken);

  public Task<PickupRequest?> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken) =>
    dbContext.PickupRequests
      .AsNoTracking()
      .AsSplitQuery()
      .Include(pickupRequest => pickupRequest.Address)
      .Include(pickupRequest => pickupRequest.Items)
      .ThenInclude(item => item.Photos)
      .SingleOrDefaultAsync(
        pickupRequest => pickupRequest.Id == id && pickupRequest.UserId == userId,
        cancellationToken);

  public async Task<IReadOnlyList<PickupRequest>> GetAllAsync(CancellationToken cancellationToken) =>
    await dbContext.PickupRequests
      .AsNoTracking()
      .AsSplitQuery()
      .Include(pickupRequest => pickupRequest.Address)
      .Include(pickupRequest => pickupRequest.Items)
      .ThenInclude(item => item.Photos)
      .OrderByDescending(pickupRequest => pickupRequest.CreatedUtc)
      .ToListAsync(cancellationToken);

  public Task<PickupRequest?> GetByIdForAdminAsync(Guid id, CancellationToken cancellationToken) =>
    dbContext.PickupRequests
      .AsNoTracking()
      .AsSplitQuery()
      .Include(pickupRequest => pickupRequest.Address)
      .Include(pickupRequest => pickupRequest.Items)
      .ThenInclude(item => item.Photos)
      .SingleOrDefaultAsync(
        pickupRequest => pickupRequest.Id == id,
        cancellationToken);

  public Task<PickupItem?> GetOwnedItemByIdAsync(Guid itemId, Guid userId, CancellationToken cancellationToken) =>
    dbContext.PickupItems
      .AsNoTracking()
      .Include(item => item.PickupRequest)
      .Include(item => item.Photos)
      .SingleOrDefaultAsync(
        item => item.Id == itemId && item.PickupRequest.UserId == userId,
        cancellationToken);

  public Task AddPhotoAsync(ItemPhoto photo, CancellationToken cancellationToken) =>
    dbContext.ItemPhotos.AddAsync(photo, cancellationToken).AsTask();

  public Task SaveChangesAsync(CancellationToken cancellationToken) =>
    dbContext.SaveChangesAsync(cancellationToken);
}
