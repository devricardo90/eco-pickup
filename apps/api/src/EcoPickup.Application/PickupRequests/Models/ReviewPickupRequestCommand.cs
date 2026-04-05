namespace EcoPickup.Application.PickupRequests.Models;

public sealed record ReviewPickupRequestCommand(
  string Decision,
  string? Note);
