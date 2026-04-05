namespace EcoPickup.Application.PickupRequests.Models;

public sealed record PickupRequestPricingResult(
  decimal BasePrice,
  decimal SizeAdjustment,
  decimal FloorAdjustment,
  decimal DistanceAdjustment,
  decimal Total,
  string Currency);
