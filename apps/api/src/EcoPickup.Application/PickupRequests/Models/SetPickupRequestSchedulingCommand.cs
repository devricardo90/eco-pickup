namespace EcoPickup.Application.PickupRequests.Models;

public sealed record SetPickupRequestSchedulingCommand(
  DateTime ConfirmedPickupWindowStartUtc,
  DateTime ConfirmedPickupWindowEndUtc,
  string? Note);
