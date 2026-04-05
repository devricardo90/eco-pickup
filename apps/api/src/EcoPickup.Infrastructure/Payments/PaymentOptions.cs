namespace EcoPickup.Infrastructure.Payments;

public sealed class PaymentOptions
{
  public const string SectionName = "Payments";

  public string ProviderName { get; set; } = "FakeCheckout";

  public string CheckoutBaseUrl { get; set; } = "https://payments.ecopickup.local/checkout";

  public string WebhookSecret { get; set; } = string.Empty;
}
