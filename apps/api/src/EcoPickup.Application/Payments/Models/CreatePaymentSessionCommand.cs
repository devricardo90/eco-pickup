namespace EcoPickup.Application.Payments.Models;

public sealed record CreatePaymentSessionCommand(
  Guid PickupRequestId,
  decimal Amount,
  string Currency,
  string Description);
