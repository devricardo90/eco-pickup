namespace EcoPickup.Application.PickupRequests.Models;

public sealed record PickupItemResult(
  Guid Id,
  string Category,
  string Description,
  string EstimatedSize,
  DateTime CreatedUtc,
  IReadOnlyList<PickupItemPhotoResult> Photos);
