using System.Security.Claims;
using EcoPickup.Application.PickupRequests.Abstractions;
using EcoPickup.Application.PickupRequests.Exceptions;
using EcoPickup.Application.PickupRequests.Models;
using EcoPickup.Domain.Identity;
using Microsoft.AspNetCore.Authorization;

namespace EcoPickup.Api.PickupRequests;

public static class AdminPickupRequestEndpoints
{
  public static IEndpointRouteBuilder MapAdminPickupRequestEndpoints(this IEndpointRouteBuilder app)
  {
    var adminPickupRequestsGroup = app.MapGroup("/api/v1/admin/pickup-requests")
      .WithTags("AdminPickupRequests")
      .RequireAuthorization(new AuthorizeAttribute { Roles = IdentityRoles.Admin });

    adminPickupRequestsGroup.MapGet("/", GetAllAsync)
      .WithName("AdminGetPickupRequests")
      .Produces<IReadOnlyList<PickupRequestResult>>(StatusCodes.Status200OK)
      .ProducesValidationProblem()
      .Produces(StatusCodes.Status401Unauthorized)
      .Produces(StatusCodes.Status403Forbidden);

    adminPickupRequestsGroup.MapGet("/{id:guid}", GetByIdAsync)
      .WithName("AdminGetPickupRequestById")
      .Produces<PickupRequestResult>(StatusCodes.Status200OK)
      .ProducesValidationProblem()
      .Produces(StatusCodes.Status401Unauthorized)
      .Produces(StatusCodes.Status403Forbidden)
      .Produces(StatusCodes.Status404NotFound);

    adminPickupRequestsGroup.MapGet("/{id:guid}/history", GetHistoryByIdAsync)
      .WithName("AdminGetPickupRequestHistoryById")
      .Produces<PickupRequestTimelineResult>(StatusCodes.Status200OK)
      .ProducesValidationProblem()
      .Produces(StatusCodes.Status401Unauthorized)
      .Produces(StatusCodes.Status403Forbidden)
      .Produces(StatusCodes.Status404NotFound);

    adminPickupRequestsGroup.MapPatch("/{id:guid}/review", ReviewAsync)
      .WithName("AdminReviewPickupRequest")
      .Produces<PickupRequestResult>(StatusCodes.Status200OK)
      .ProducesValidationProblem()
      .Produces(StatusCodes.Status401Unauthorized)
      .Produces(StatusCodes.Status403Forbidden)
      .Produces(StatusCodes.Status404NotFound);

    adminPickupRequestsGroup.MapPatch("/{id:guid}/pricing", SetPricingAsync)
      .WithName("AdminSetPickupRequestPricing")
      .Produces<PickupRequestResult>(StatusCodes.Status200OK)
      .ProducesValidationProblem()
      .Produces(StatusCodes.Status401Unauthorized)
      .Produces(StatusCodes.Status403Forbidden)
      .Produces(StatusCodes.Status404NotFound);

    adminPickupRequestsGroup.MapPatch("/{id:guid}/scheduling", SetSchedulingAsync)
      .WithName("AdminSetPickupRequestScheduling")
      .Produces<PickupRequestResult>(StatusCodes.Status200OK)
      .ProducesValidationProblem()
      .Produces(StatusCodes.Status401Unauthorized)
      .Produces(StatusCodes.Status403Forbidden)
      .Produces(StatusCodes.Status404NotFound);

    return app;
  }

  private static async Task<IResult> GetAllAsync(
    IPickupRequestService pickupRequestService,
    CancellationToken cancellationToken)
  {
    var pickupRequests = await pickupRequestService.GetAllForAdminAsync(cancellationToken);
    return Results.Ok(pickupRequests);
  }

  private static async Task<IResult> GetByIdAsync(
    Guid id,
    IPickupRequestService pickupRequestService,
    CancellationToken cancellationToken)
  {
    try
    {
      var pickupRequest = await pickupRequestService.GetByIdForAdminAsync(id, cancellationToken);
      return pickupRequest is null ? Results.NotFound() : Results.Ok(pickupRequest);
    }
    catch (PickupRequestValidationException ex)
    {
      return Results.ValidationProblem(ex.Errors.ToDictionary(pair => pair.Key, pair => pair.Value));
    }
  }

  private static async Task<IResult> GetHistoryByIdAsync(
    Guid id,
    IPickupRequestService pickupRequestService,
    CancellationToken cancellationToken)
  {
    try
    {
      var timeline = await pickupRequestService.GetHistoryByIdForAdminAsync(id, cancellationToken);
      return timeline is null ? Results.NotFound() : Results.Ok(timeline);
    }
    catch (PickupRequestValidationException ex)
    {
      return Results.ValidationProblem(ex.Errors.ToDictionary(pair => pair.Key, pair => pair.Value));
    }
  }

  private static async Task<IResult> ReviewAsync(
    ClaimsPrincipal principal,
    Guid id,
    ReviewPickupRequestRequest request,
    IPickupRequestService pickupRequestService,
    CancellationToken cancellationToken)
  {
    var subject = principal.FindFirstValue("sub");
    if (!Guid.TryParse(subject, out var adminUserId))
    {
      return Results.Unauthorized();
    }

    try
    {
      var pickupRequest = await pickupRequestService.ReviewAsync(
        id,
        adminUserId,
        new ReviewPickupRequestCommand(request.Decision, request.Note),
        cancellationToken);

      return Results.Ok(pickupRequest);
    }
    catch (PickupRequestValidationException ex)
    {
      if (ex.Errors.TryGetValue("id", out var idErrors)
        && idErrors.Contains("Pickup request was not found."))
      {
        return Results.NotFound();
      }

      return Results.ValidationProblem(ex.Errors.ToDictionary(pair => pair.Key, pair => pair.Value));
    }
  }

  private static async Task<IResult> SetPricingAsync(
    ClaimsPrincipal principal,
    Guid id,
    SetPickupRequestPricingRequest request,
    IPickupRequestService pickupRequestService,
    CancellationToken cancellationToken)
  {
    var subject = principal.FindFirstValue("sub");
    if (!Guid.TryParse(subject, out var adminUserId))
    {
      return Results.Unauthorized();
    }

    try
    {
      var pickupRequest = await pickupRequestService.SetPricingAsync(
        id,
        adminUserId,
        new SetPickupRequestPricingCommand(
          request.BasePrice,
          request.SizeAdjustment,
          request.FloorAdjustment,
          request.DistanceAdjustment,
          request.Currency,
          request.TargetStatus,
          request.Note),
        cancellationToken);

      return Results.Ok(pickupRequest);
    }
    catch (PickupRequestValidationException ex)
    {
      if (ex.Errors.TryGetValue("id", out var idErrors)
        && idErrors.Contains("Pickup request was not found."))
      {
        return Results.NotFound();
      }

      return Results.ValidationProblem(ex.Errors.ToDictionary(pair => pair.Key, pair => pair.Value));
    }
  }

  private static async Task<IResult> SetSchedulingAsync(
    ClaimsPrincipal principal,
    Guid id,
    SetPickupRequestSchedulingRequest request,
    IPickupRequestService pickupRequestService,
    CancellationToken cancellationToken)
  {
    var subject = principal.FindFirstValue("sub");
    if (!Guid.TryParse(subject, out var adminUserId))
    {
      return Results.Unauthorized();
    }

    try
    {
      var pickupRequest = await pickupRequestService.SetSchedulingAsync(
        id,
        adminUserId,
        new SetPickupRequestSchedulingCommand(
          request.ConfirmedPickupWindowStartUtc,
          request.ConfirmedPickupWindowEndUtc,
          request.Note),
        cancellationToken);

      return Results.Ok(pickupRequest);
    }
    catch (PickupRequestValidationException ex)
    {
      if (ex.Errors.TryGetValue("id", out var idErrors)
        && idErrors.Contains("Pickup request was not found."))
      {
        return Results.NotFound();
      }

      return Results.ValidationProblem(ex.Errors.ToDictionary(pair => pair.Key, pair => pair.Value));
    }
  }

  public sealed record ReviewPickupRequestRequest(
    string Decision,
    string? Note);

  public sealed record SetPickupRequestPricingRequest(
    decimal BasePrice,
    decimal SizeAdjustment,
    decimal FloorAdjustment,
    decimal DistanceAdjustment,
    string Currency,
    string TargetStatus,
    string? Note);

  public sealed record SetPickupRequestSchedulingRequest(
    DateTime ConfirmedPickupWindowStartUtc,
    DateTime ConfirmedPickupWindowEndUtc,
    string? Note);
}
