namespace EcoPickup.Application.PickupRequests.Models;

public sealed record CreatePickupItemCommand(
  string Category,
  string Description,
  string EstimatedSize);
