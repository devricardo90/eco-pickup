namespace EcoPickup.Domain.PickupRequests;

public static class PaymentStatuses
{
  public const string Pending = "pending";

  public const string Paid = "paid";

  public const string Failed = "failed";

  public const string Cancelled = "cancelled";

  public static bool IsTerminal(string status) =>
    status is Paid or Failed or Cancelled;
}
