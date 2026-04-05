namespace EcoPickup.Application.PickupRequests.Models;

public sealed record CreatePickupRequestAddressCommand(
  string Street,
  string City,
  string PostalCode,
  string? Floor,
  bool HasElevator,
  string? AccessNotes);
