namespace EcoPickup.Domain.PickupRequests;

public sealed class Address
{
  public Guid Id { get; set; }

  public Guid PickupRequestId { get; set; }

  public string Street { get; set; } = string.Empty;

  public string City { get; set; } = string.Empty;

  public string PostalCode { get; set; } = string.Empty;

  public string? Floor { get; set; }

  public bool HasElevator { get; set; }

  public string? AccessNotes { get; set; }

  public PickupRequest PickupRequest { get; set; } = null!;
}
