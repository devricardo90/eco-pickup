using System.Security.Claims;
using EcoPickup.Application.PickupRequests.Abstractions;
using EcoPickup.Application.PickupRequests.Exceptions;
using EcoPickup.Application.PickupRequests.Models;

namespace EcoPickup.Api.PickupRequests;

public static class PickupRequestEndpoints
{
  public static IEndpointRouteBuilder MapPickupRequestEndpoints(this IEndpointRouteBuilder app)
  {
    var pickupRequestsGroup = app.MapGroup("/api/v1/pickup-requests")
      .WithTags("PickupRequests")
      .RequireAuthorization();

    pickupRequestsGroup.MapPost("/", CreateAsync)
      .WithName("CreatePickupRequest")
      .Produces<PickupRequestResult>(StatusCodes.Status201Created)
      .ProducesValidationProblem()
      .Produces(StatusCodes.Status401Unauthorized);

    pickupRequestsGroup.MapGet("/", GetByUserAsync)
      .WithName("GetPickupRequests")
      .Produces<IReadOnlyList<PickupRequestResult>>(StatusCodes.Status200OK)
      .ProducesValidationProblem()
      .Produces(StatusCodes.Status401Unauthorized);

    pickupRequestsGroup.MapGet("/{id:guid}", GetByIdAsync)
      .WithName("GetPickupRequestById")
      .Produces<PickupRequestResult>(StatusCodes.Status200OK)
      .ProducesValidationProblem()
      .Produces(StatusCodes.Status401Unauthorized)
      .Produces(StatusCodes.Status404NotFound);

    pickupRequestsGroup.MapGet("/{id:guid}/history", GetHistoryByIdAsync)
      .WithName("GetPickupRequestHistoryById")
      .Produces<PickupRequestTimelineResult>(StatusCodes.Status200OK)
      .ProducesValidationProblem()
      .Produces(StatusCodes.Status401Unauthorized)
      .Produces(StatusCodes.Status404NotFound);

    return app;
  }

  private static async Task<IResult> CreateAsync(
    ClaimsPrincipal principal,
    CreatePickupRequestRequest request,
    IPickupRequestService pickupRequestService,
    CancellationToken cancellationToken)
  {
    var subject = principal.FindFirstValue("sub");
    if (!Guid.TryParse(subject, out var userId))
    {
      return Results.Unauthorized();
    }

    try
    {
      var pickupRequest = await pickupRequestService.CreateAsync(
        userId,
        new CreatePickupRequestCommand(
          request.Description,
          request.PickupWindowStartUtc,
          request.PickupWindowEndUtc,
          new CreatePickupRequestAddressCommand(
            request.Address.Street,
            request.Address.City,
            request.Address.PostalCode,
            request.Address.Floor,
            request.Address.HasElevator,
            request.Address.AccessNotes),
          request.Items.Select(item => new CreatePickupItemCommand(
            item.Category,
            item.Description,
            item.EstimatedSize)).ToArray()),
        cancellationToken);

      return Results.Created($"/api/v1/pickup-requests/{pickupRequest.Id}", pickupRequest);
    }
    catch (PickupRequestValidationException ex)
    {
      return Results.ValidationProblem(ex.Errors.ToDictionary(pair => pair.Key, pair => pair.Value));
    }
  }

  private static async Task<IResult> GetByUserAsync(
    ClaimsPrincipal principal,
    IPickupRequestService pickupRequestService,
    CancellationToken cancellationToken)
  {
    var subject = principal.FindFirstValue("sub");
    if (!Guid.TryParse(subject, out var userId))
    {
      return Results.Unauthorized();
    }

    try
    {
      var pickupRequests = await pickupRequestService.GetByUserAsync(userId, cancellationToken);
      return Results.Ok(pickupRequests);
    }
    catch (PickupRequestValidationException ex)
    {
      return Results.ValidationProblem(ex.Errors.ToDictionary(pair => pair.Key, pair => pair.Value));
    }
  }

  private static async Task<IResult> GetByIdAsync(
    ClaimsPrincipal principal,
    Guid id,
    IPickupRequestService pickupRequestService,
    CancellationToken cancellationToken)
  {
    var subject = principal.FindFirstValue("sub");
    if (!Guid.TryParse(subject, out var userId))
    {
      return Results.Unauthorized();
    }

    try
    {
      var pickupRequest = await pickupRequestService.GetByIdAsync(id, userId, cancellationToken);
      return pickupRequest is null ? Results.NotFound() : Results.Ok(pickupRequest);
    }
    catch (PickupRequestValidationException ex)
    {
      return Results.ValidationProblem(ex.Errors.ToDictionary(pair => pair.Key, pair => pair.Value));
    }
  }

  private static async Task<IResult> GetHistoryByIdAsync(
    ClaimsPrincipal principal,
    Guid id,
    IPickupRequestService pickupRequestService,
    CancellationToken cancellationToken)
  {
    var subject = principal.FindFirstValue("sub");
    if (!Guid.TryParse(subject, out var userId))
    {
      return Results.Unauthorized();
    }

    try
    {
      var timeline = await pickupRequestService.GetHistoryByIdAsync(id, userId, cancellationToken);
      return timeline is null ? Results.NotFound() : Results.Ok(timeline);
    }
    catch (PickupRequestValidationException ex)
    {
      return Results.ValidationProblem(ex.Errors.ToDictionary(pair => pair.Key, pair => pair.Value));
    }
  }

  public sealed record CreatePickupRequestRequest(
    string Description,
    DateTime PickupWindowStartUtc,
    DateTime PickupWindowEndUtc,
    CreatePickupRequestAddressRequest Address,
    IReadOnlyList<CreatePickupRequestItemRequest> Items);

  public sealed record CreatePickupRequestAddressRequest(
    string Street,
    string City,
    string PostalCode,
    string? Floor,
    bool HasElevator,
    string? AccessNotes);

  public sealed record CreatePickupRequestItemRequest(
    string Category,
    string Description,
    string EstimatedSize);
}
