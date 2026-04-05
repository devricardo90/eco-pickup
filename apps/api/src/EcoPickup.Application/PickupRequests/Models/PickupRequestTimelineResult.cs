namespace EcoPickup.Application.PickupRequests.Models;

public sealed record PickupRequestTimelineResult(
  Guid PickupRequestId,
  string CurrentStatus,
  IReadOnlyList<PickupRequestTimelineEventResult> Events);
