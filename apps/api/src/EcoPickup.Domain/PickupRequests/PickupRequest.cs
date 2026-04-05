namespace EcoPickup.Domain.PickupRequests;

public sealed class PickupRequest
{
  public Guid Id { get; set; }

  public Guid UserId { get; set; }

  public string Description { get; set; } = string.Empty;

  public DateTime PickupWindowStartUtc { get; set; }

  public DateTime PickupWindowEndUtc { get; set; }

  public string Status { get; set; } = PickupRequestStatuses.Draft;

  public decimal? PriceBase { get; set; }

  public decimal? PriceSizeAdjustment { get; set; }

  public decimal? PriceFloorAdjustment { get; set; }

  public decimal? PriceDistanceAdjustment { get; set; }

  public decimal? PriceTotal { get; set; }

  public string? PriceCurrency { get; set; }

  public DateTime? ConfirmedPickupWindowStartUtc { get; set; }

  public DateTime? ConfirmedPickupWindowEndUtc { get; set; }

  public DateTime CreatedUtc { get; set; }

  public Address Address { get; set; } = null!;

  public List<PickupItem> Items { get; set; } = [];

  public List<PickupRequestStatusHistory> StatusHistory { get; set; } = [];
}
