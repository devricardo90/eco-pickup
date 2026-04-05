namespace EcoPickup.Application.Payments.Models;

public sealed record PaymentSessionResult(
  string Provider,
  string ProviderSessionId,
  string CheckoutUrl);
