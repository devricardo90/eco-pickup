namespace EcoPickup.Domain.PickupRequests;

public sealed class PickupRequest
{
  public Guid Id { get; set; }

  public Guid UserId { get; set; }

  public string Description { get; set; } = string.Empty;

  public DateTime PickupWindowStartUtc { get; set; }

  public DateTime PickupWindowEndUtc { get; set; }

  public string Status { get; set; } = PickupRequestStatuses.Draft;

  public DateTime CreatedUtc { get; set; }

  public Address Address { get; set; } = null!;

  public List<PickupItem> Items { get; set; } = [];
}
