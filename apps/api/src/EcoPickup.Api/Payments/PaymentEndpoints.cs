using System.Security.Claims;
using EcoPickup.Application.Payments.Abstractions;
using EcoPickup.Application.Payments.Models;
using EcoPickup.Application.PickupRequests.Exceptions;
using EcoPickup.Infrastructure.Payments;
using Microsoft.Extensions.Options;

namespace EcoPickup.Api.Payments;

public static class PaymentEndpoints
{
  public static IEndpointRouteBuilder MapPaymentEndpoints(this IEndpointRouteBuilder app)
  {
    app.MapPost("/api/v1/pickup-requests/{id:guid}/payments", CreateSessionAsync)
      .WithTags("Payments")
      .WithName("CreatePickupRequestPayment")
      .RequireAuthorization()
      .Produces<PaymentResult>(StatusCodes.Status201Created)
      .ProducesValidationProblem()
      .Produces(StatusCodes.Status401Unauthorized)
      .Produces(StatusCodes.Status404NotFound);

    app.MapPost("/api/v1/payments/webhook", ConfirmAsync)
      .WithTags("Payments")
      .WithName("ConfirmPaymentWebhook")
      .Produces<PaymentResult>(StatusCodes.Status200OK)
      .ProducesValidationProblem()
      .Produces(StatusCodes.Status401Unauthorized)
      .Produces(StatusCodes.Status404NotFound);

    return app;
  }

  private static async Task<IResult> CreateSessionAsync(
    ClaimsPrincipal principal,
    Guid id,
    IPaymentService paymentService,
    CancellationToken cancellationToken)
  {
    var subject = principal.FindFirstValue("sub");
    if (!Guid.TryParse(subject, out var userId))
    {
      return Results.Unauthorized();
    }

    try
    {
      var payment = await paymentService.CreateSessionAsync(id, userId, cancellationToken);
      return Results.Created($"/api/v1/payments/{payment.Id}", payment);
    }
    catch (PickupRequestValidationException ex)
    {
      if (ex.Errors.TryGetValue("pickupRequestId", out var idErrors)
        && idErrors.Contains("Pickup request was not found."))
      {
        return Results.NotFound();
      }

      return Results.ValidationProblem(ex.Errors.ToDictionary(pair => pair.Key, pair => pair.Value));
    }
  }

  private static async Task<IResult> ConfirmAsync(
    HttpRequest httpRequest,
    ConfirmPaymentRequest request,
    IPaymentService paymentService,
    IOptions<PaymentOptions> paymentOptions,
    CancellationToken cancellationToken)
  {
    if (!httpRequest.Headers.TryGetValue("X-Payment-Webhook-Secret", out var secret)
      || secret != paymentOptions.Value.WebhookSecret)
    {
      return Results.Unauthorized();
    }

    try
    {
      var payment = await paymentService.ConfirmAsync(
        new ConfirmPaymentCommand(
          request.ProviderSessionId,
          request.Status,
          request.ProviderPaymentId,
          request.FailureReason),
        cancellationToken);

      return payment is null ? Results.NotFound() : Results.Ok(payment);
    }
    catch (PickupRequestValidationException ex)
    {
      return Results.ValidationProblem(ex.Errors.ToDictionary(pair => pair.Key, pair => pair.Value));
    }
  }

  public sealed record ConfirmPaymentRequest(
    string ProviderSessionId,
    string Status,
    string? ProviderPaymentId,
    string? FailureReason);
}
