namespace EcoPickup.Application.PickupRequests.Models;

public sealed record UpdatePickupRequestCommand(
  string Description,
  DateTime PickupWindowStartUtc,
  DateTime PickupWindowEndUtc,
  CreatePickupRequestAddressCommand Address,
  IReadOnlyList<CreatePickupItemCommand> Items);
