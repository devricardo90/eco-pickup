using EcoPickup.Domain.PickupRequests;

namespace EcoPickup.Application.Payments;

public static class PaymentConfirmationStatuses
{
  public static bool IsSupported(string status) =>
    status is PaymentStatuses.Paid or PaymentStatuses.Failed or PaymentStatuses.Cancelled;
}
