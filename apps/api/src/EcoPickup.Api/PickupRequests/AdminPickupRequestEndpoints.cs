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
}
