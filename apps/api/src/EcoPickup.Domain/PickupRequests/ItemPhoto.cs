namespace EcoPickup.Domain.PickupRequests;

public sealed class ItemPhoto
{
  public Guid Id { get; set; }

  public Guid PickupItemId { get; set; }

  public string StorageKey { get; set; } = string.Empty;

  public string OriginalFileName { get; set; } = string.Empty;

  public string ContentType { get; set; } = string.Empty;

  public long SizeBytes { get; set; }

  public DateTime CreatedUtc { get; set; }

  public PickupItem PickupItem { get; set; } = null!;
}
