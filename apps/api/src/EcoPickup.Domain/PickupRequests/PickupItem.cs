namespace EcoPickup.Domain.PickupRequests;

public sealed class PickupItem
{
  public Guid Id { get; set; }

  public Guid PickupRequestId { get; set; }

  public string Category { get; set; } = string.Empty;

  public string Description { get; set; } = string.Empty;

  public string EstimatedSize { get; set; } = PickupItemSizes.Medium;

  public DateTime CreatedUtc { get; set; }

  public PickupRequest PickupRequest { get; set; } = null!;

  public List<ItemPhoto> Photos { get; set; } = [];
}
