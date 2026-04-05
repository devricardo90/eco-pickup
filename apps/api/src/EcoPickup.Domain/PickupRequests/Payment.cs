namespace EcoPickup.Domain.PickupRequests;

public sealed class Payment
{
  public Guid Id { get; set; }

  public Guid PickupRequestId { get; set; }

  public string Provider { get; set; } = string.Empty;

  public string ProviderSessionId { get; set; } = string.Empty;

  public string CheckoutUrl { get; set; } = string.Empty;

  public decimal Amount { get; set; }

  public string Currency { get; set; } = string.Empty;

  public string Status { get; set; } = PaymentStatuses.Pending;

  public string? ProviderPaymentId { get; set; }

  public string? FailureReason { get; set; }

  public DateTime CreatedUtc { get; set; }

  public DateTime UpdatedUtc { get; set; }

  public DateTime? ConfirmedUtc { get; set; }

  public PickupRequest PickupRequest { get; set; } = null!;
}
