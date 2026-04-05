using EcoPickup.Domain.PickupRequests;

namespace EcoPickup.Application.PickupRequests;

public static class PickupRequestSchedulingStatuses
{
  public static bool CanScheduleFrom(string currentStatus) =>
    currentStatus == PickupRequestStatuses.Quoted;
}
