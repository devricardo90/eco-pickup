namespace EcoPickup.Application.PickupRequests.Models;

public sealed record SetPickupRequestPricingCommand(
  decimal BasePrice,
  decimal SizeAdjustment,
  decimal FloorAdjustment,
  decimal DistanceAdjustment,
  string Currency,
  string TargetStatus,
  string? Note);
