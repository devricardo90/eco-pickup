using EcoPickup.Domain.PickupRequests;

namespace EcoPickup.Application.PickupRequests;

public static class PickupRequestPricingStatuses
{
  public static bool IsSupportedTarget(string targetStatus) =>
    targetStatus is PickupRequestStatuses.Quoted or PickupRequestStatuses.AwaitingPayment;
}
