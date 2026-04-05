namespace EcoPickup.Domain.PickupRequests;

public static class PickupRequestStatuses
{
  public const string Draft = "draft";

  public const string Submitted = "submitted";

  public const string UnderReview = "under_review";

  public const string Quoted = "quoted";

  public const string AwaitingPayment = "awaiting_payment";

  public const string Paid = "paid";

  public const string Scheduled = "scheduled";

  public const string InTransit = "in_transit";

  public const string Collected = "collected";

  public const string Completed = "completed";

  public const string Cancelled = "cancelled";

  public const string Rejected = "rejected";
}
