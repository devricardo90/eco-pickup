using EcoPickup.Application.PickupRequests.Models;

namespace EcoPickup.Application.PickupRequests.Abstractions;

public interface IPickupRequestService
{
  Task<PickupRequestResult> CreateAsync(
    Guid userId,
    CreatePickupRequestCommand command,
    CancellationToken cancellationToken);

  Task<PickupRequestResult> UpdateAsync(
    Guid id,
    Guid userId,
    UpdatePickupRequestCommand command,
    CancellationToken cancellationToken);

  Task<IReadOnlyList<PickupRequestResult>> GetByUserAsync(
    Guid userId,
    CancellationToken cancellationToken);

  Task<PickupRequestResult?> GetByIdAsync(
    Guid id,
    Guid userId,
    CancellationToken cancellationToken);

  Task<PickupRequestTimelineResult?> GetHistoryByIdAsync(
    Guid id,
    Guid userId,
    CancellationToken cancellationToken);

  Task<IReadOnlyList<PickupRequestResult>> GetAllForAdminAsync(
    CancellationToken cancellationToken);

  Task<PickupRequestResult?> GetByIdForAdminAsync(
    Guid id,
    CancellationToken cancellationToken);

  Task<PickupRequestTimelineResult?> GetHistoryByIdForAdminAsync(
    Guid id,
    CancellationToken cancellationToken);

  Task<PickupRequestResult> ReviewAsync(
    Guid id,
    Guid adminUserId,
    ReviewPickupRequestCommand command,
    CancellationToken cancellationToken);

  Task<PickupRequestResult> SetPricingAsync(
    Guid id,
    Guid adminUserId,
    SetPickupRequestPricingCommand command,
    CancellationToken cancellationToken);

  Task<PickupRequestResult> SetSchedulingAsync(
    Guid id,
    Guid adminUserId,
    SetPickupRequestSchedulingCommand command,
    CancellationToken cancellationToken);
}
