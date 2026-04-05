namespace EcoPickup.Application.Payments.Models;

public sealed record ConfirmPaymentCommand(
  string ProviderSessionId,
  string Status,
  string? ProviderPaymentId,
  string? FailureReason);
