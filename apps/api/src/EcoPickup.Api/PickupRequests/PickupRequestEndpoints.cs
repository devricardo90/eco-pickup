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
