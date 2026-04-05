namespace EcoPickup.Application.PickupRequests.Models;

public sealed record PickupRequestResult(
  Guid Id,
  Guid UserId,
  string Description,
  string Status,
  PickupRequestPricingResult? Pricing,
  DateTime PickupWindowStartUtc,
  DateTime PickupWindowEndUtc,
  DateTime CreatedUtc,
  PickupRequestAddressResult Address,
  IReadOnlyList<PickupItemResult> Items);
