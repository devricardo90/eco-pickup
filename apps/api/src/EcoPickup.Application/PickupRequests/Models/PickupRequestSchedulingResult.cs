namespace EcoPickup.Application.PickupRequests.Models;

public sealed record PickupRequestSchedulingResult(
  DateTime ConfirmedPickupWindowStartUtc,
  DateTime ConfirmedPickupWindowEndUtc);
