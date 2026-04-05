namespace EcoPickup.Application.Payments.Models;

public sealed record PaymentResult(
  Guid Id,
  Guid PickupRequestId,
  string Provider,
  string ProviderSessionId,
  string CheckoutUrl,
  decimal Amount,
  string Currency,
  string Status,
  string? ProviderPaymentId,
  string? FailureReason,
  DateTime CreatedUtc,
  DateTime UpdatedUtc,
  DateTime? ConfirmedUtc);
