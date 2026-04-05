namespace EcoPickup.Domain.PickupRequests;

public sealed class PickupRequestStatusHistory
{
  public Guid Id { get; set; }

  public Guid PickupRequestId { get; set; }

  public string FromStatus { get; set; } = string.Empty;

  public string ToStatus { get; set; } = string.Empty;

  public string Action { get; set; } = string.Empty;

  public Guid ActorUserId { get; set; }

  public string? Note { get; set; }

  public DateTime CreatedUtc { get; set; }

  public PickupRequest PickupRequest { get; set; } = null!;
}
