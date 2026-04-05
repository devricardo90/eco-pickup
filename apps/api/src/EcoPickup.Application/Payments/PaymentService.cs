using EcoPickup.Application.Payments.Abstractions;
using EcoPickup.Application.Payments.Models;
using EcoPickup.Application.PickupRequests.Exceptions;
using EcoPickup.Domain.PickupRequests;

namespace EcoPickup.Application.Payments;

public sealed class PaymentService(
  IPaymentRepository paymentRepository,
  IPaymentGateway paymentGateway) : IPaymentService
{
  public async Task<PaymentResult> CreateSessionAsync(
    Guid pickupRequestId,
    Guid userId,
    CancellationToken cancellationToken)
  {
    var errors = new Dictionary<string, string[]>();

    if (pickupRequestId == Guid.Empty)
    {
      errors["pickupRequestId"] = ["Pickup request id is required."];
    }

    if (userId == Guid.Empty)
    {
      errors["userId"] = ["Authenticated user is required."];
    }

    if (errors.Count > 0)
    {
      throw new PickupRequestValidationException(errors);
    }

    var pickupRequest = await paymentRepository.GetOwnedRequestForPaymentAsync(pickupRequestId, userId, cancellationToken);
    if (pickupRequest is null)
    {
      throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["pickupRequestId"] = ["Pickup request was not found."]
      });
    }

    if (pickupRequest.Status != PickupRequestStatuses.AwaitingPayment)
    {
      throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["status"] = [$"Payment session cannot be created when request status is '{pickupRequest.Status}'."]
      });
    }

    if (pickupRequest.PriceTotal is null || pickupRequest.PriceTotal <= 0)
    {
      throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["pricing"] = ["A positive pricing total is required before payment can start."]
      });
    }

    if (string.IsNullOrWhiteSpace(pickupRequest.PriceCurrency))
    {
      throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["pricing"] = ["Pricing currency is required before payment can start."]
      });
    }

    if (pickupRequest.Payments.Any(payment => payment.Status == PaymentStatuses.Pending))
    {
      throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["payment"] = ["An active payment session already exists for this request."]
      });
    }

    if (pickupRequest.Payments.Any(payment => payment.Status == PaymentStatuses.Paid))
    {
      throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["payment"] = ["This request has already been paid."]
      });
    }

    var session = await paymentGateway.CreateSessionAsync(
      new CreatePaymentSessionCommand(
        pickupRequest.Id,
        pickupRequest.PriceTotal.Value,
        pickupRequest.PriceCurrency,
        pickupRequest.Description),
      cancellationToken);

    var now = DateTime.UtcNow;
    var payment = new Payment
    {
      Id = Guid.NewGuid(),
      PickupRequestId = pickupRequest.Id,
      Provider = session.Provider,
      ProviderSessionId = session.ProviderSessionId,
      CheckoutUrl = session.CheckoutUrl,
      Amount = pickupRequest.PriceTotal.Value,
      Currency = pickupRequest.PriceCurrency,
      Status = PaymentStatuses.Pending,
      CreatedUtc = now,
      UpdatedUtc = now
    };

    await paymentRepository.AddAsync(payment, cancellationToken);
    await paymentRepository.SaveChangesAsync(cancellationToken);

    return ToResult(payment);
  }

  public async Task<PaymentResult?> ConfirmAsync(
    ConfirmPaymentCommand command,
    CancellationToken cancellationToken)
  {
    var errors = new Dictionary<string, string[]>();

    if (string.IsNullOrWhiteSpace(command.ProviderSessionId))
    {
      errors["providerSessionId"] = ["Provider session id is required."];
    }

    var normalizedStatus = command.Status.Trim().ToLowerInvariant();
    if (!PaymentConfirmationStatuses.IsSupported(normalizedStatus))
    {
      errors["status"] = ["Payment status must be one of: paid, failed, cancelled."];
    }

    if (errors.Count > 0)
    {
      throw new PickupRequestValidationException(errors);
    }

    var payment = await paymentRepository.GetByProviderSessionIdAsync(command.ProviderSessionId.Trim(), cancellationToken);
    if (payment is null)
    {
      return null;
    }

    if (payment.Status == normalizedStatus)
    {
      return ToResult(payment);
    }

    if (PaymentStatuses.IsTerminal(payment.Status))
    {
      throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["payment"] = [$"Payment cannot transition from terminal status '{payment.Status}' to '{normalizedStatus}'."]
      });
    }

    payment.Status = normalizedStatus;
    payment.ProviderPaymentId = NormalizeOptional(command.ProviderPaymentId);
    payment.FailureReason = NormalizeOptional(command.FailureReason);
    payment.UpdatedUtc = DateTime.UtcNow;

    if (normalizedStatus == PaymentStatuses.Paid)
    {
      if (payment.PickupRequest.Status != PickupRequestStatuses.AwaitingPayment)
      {
        throw new PickupRequestValidationException(new Dictionary<string, string[]>
        {
          ["status"] = [$"Payment cannot be confirmed as paid when request status is '{payment.PickupRequest.Status}'."]
        });
      }

      payment.ConfirmedUtc = payment.UpdatedUtc;
      payment.PickupRequest.StatusHistory.Add(new PickupRequestStatusHistory
      {
        Id = Guid.NewGuid(),
        PickupRequestId = payment.PickupRequestId,
        FromStatus = payment.PickupRequest.Status,
        ToStatus = PickupRequestStatuses.Paid,
        Action = "payment",
        ActorUserId = Guid.Empty,
        Note = "Payment confirmed by secure webhook.",
        CreatedUtc = DateTime.UtcNow
      });
      payment.PickupRequest.Status = PickupRequestStatuses.Paid;
    }

    await paymentRepository.SaveChangesAsync(cancellationToken);

    return ToResult(payment);
  }

  private static string? NormalizeOptional(string? value) =>
    string.IsNullOrWhiteSpace(value) ? null : value.Trim();

  private static PaymentResult ToResult(Payment payment) =>
    new(
      payment.Id,
      payment.PickupRequestId,
      payment.Provider,
      payment.ProviderSessionId,
      payment.CheckoutUrl,
      payment.Amount,
      payment.Currency,
      payment.Status,
      payment.ProviderPaymentId,
      payment.FailureReason,
      payment.CreatedUtc,
      payment.UpdatedUtc,
      payment.ConfirmedUtc);
}
