namespace EcoPickup.Application.PickupRequests;

public static class PickupRequestReviewDecisions
{
  public const string Approve = "approve";

  public const string Reject = "reject";

  public static bool IsSupported(string decision) =>
    decision is Approve or Reject;
}
