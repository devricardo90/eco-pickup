namespace EcoPickup.Application.PickupRequests.Models;

public sealed record PickupRequestResult(
  Guid Id,
  Guid UserId,
  string Description,
  string Status,
  DateTime PickupWindowStartUtc,
  DateTime PickupWindowEndUtc,
  DateTime CreatedUtc,
  PickupRequestAddressResult Address);
