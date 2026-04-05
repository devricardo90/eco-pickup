using EcoPickup.Application.PickupRequests.Abstractions;
using EcoPickup.Domain.PickupRequests;
using EcoPickup.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EcoPickup.Infrastructure.PickupRequests;

public sealed class PickupRequestRepository(EcoPickupDbContext dbContext) : IPickupRequestRepository
{
  public Task AddAsync(PickupRequest pickupRequest, CancellationToken cancellationToken) =>
    dbContext.PickupRequests.AddAsync(pickupRequest, cancellationToken).AsTask();

  public async Task<IReadOnlyList<PickupRequest>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken) =>
    await dbContext.PickupRequests
      .AsNoTracking()
      .Include(pickupRequest => pickupRequest.Address)
      .Include(pickupRequest => pickupRequest.Items)
      .Where(pickupRequest => pickupRequest.UserId == userId)
      .OrderByDescending(pickupRequest => pickupRequest.CreatedUtc)
      .ToListAsync(cancellationToken);

  public Task<PickupRequest?> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken) =>
    dbContext.PickupRequests
      .AsNoTracking()
      .Include(pickupRequest => pickupRequest.Address)
      .Include(pickupRequest => pickupRequest.Items)
      .SingleOrDefaultAsync(
        pickupRequest => pickupRequest.Id == id && pickupRequest.UserId == userId,
        cancellationToken);

  public Task SaveChangesAsync(CancellationToken cancellationToken) =>
    dbContext.SaveChangesAsync(cancellationToken);
}
