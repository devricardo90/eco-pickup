namespace EcoPickup.Application.PickupRequests.Models;

public sealed record PickupRequestAddressResult(
  Guid Id,
  string Street,
  string City,
  string PostalCode,
  string? Floor,
  bool HasElevator,
  string? AccessNotes);
