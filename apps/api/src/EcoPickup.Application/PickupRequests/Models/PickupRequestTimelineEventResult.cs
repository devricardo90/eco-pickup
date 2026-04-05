namespace EcoPickup.Application.PickupRequests.Models;

public sealed record PickupRequestTimelineEventResult(
  Guid Id,
  string Action,
  string FromStatus,
  string ToStatus,
  Guid? ActorUserId,
  string? Note,
  DateTime CreatedUtc);
