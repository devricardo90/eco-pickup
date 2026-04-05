using System.Security.Claims;
using EcoPickup.Application.PickupRequests;
using EcoPickup.Application.PickupRequests.Abstractions;
using EcoPickup.Application.PickupRequests.Exceptions;
using EcoPickup.Application.PickupRequests.Models;

namespace EcoPickup.Api.PickupRequests;

public static class PickupItemPhotoEndpoints
{
  public static IEndpointRouteBuilder MapPickupItemPhotoEndpoints(this IEndpointRouteBuilder app)
  {
    var pickupItemsGroup = app.MapGroup("/api/v1/pickup-items")
      .WithTags("PickupItemPhotos")
      .RequireAuthorization();

    pickupItemsGroup.MapPost("/{itemId:guid}/photos", UploadAsync)
      .DisableAntiforgery()
      .WithName("UploadPickupItemPhoto")
      .Accepts<IFormFile>("multipart/form-data")
      .Produces<PickupItemPhotoResult>(StatusCodes.Status201Created)
      .ProducesValidationProblem()
      .Produces(StatusCodes.Status401Unauthorized)
      .Produces(StatusCodes.Status404NotFound);

    return app;
  }

  private static async Task<IResult> UploadAsync(
    ClaimsPrincipal principal,
    Guid itemId,
    IFormFile file,
    IPickupItemPhotoService pickupItemPhotoService,
    CancellationToken cancellationToken)
  {
    var subject = principal.FindFirstValue("sub");
    if (!Guid.TryParse(subject, out var userId))
    {
      return Results.Unauthorized();
    }

    if (file.Length > PickupItemPhotoService.MaxFileSizeBytes)
    {
      return Results.ValidationProblem(new Dictionary<string, string[]>
      {
        ["file"] = [$"File size must be at most {PickupItemPhotoService.MaxFileSizeBytes} bytes."]
      });
    }

    byte[] content;
    await using (var input = file.OpenReadStream())
    await using (var buffer = new MemoryStream())
    {
      await input.CopyToAsync(buffer, cancellationToken);
      content = buffer.ToArray();
    }

    try
    {
      var photo = await pickupItemPhotoService.UploadAsync(
        itemId,
        userId,
        new UploadPickupItemPhotoCommand(
          file.FileName,
          file.ContentType,
          content),
        cancellationToken);

      return photo is null
        ? Results.NotFound()
        : Results.Created($"/api/v1/pickup-items/{itemId}/photos/{photo.Id}", photo);
    }
    catch (PickupRequestValidationException ex)
    {
      return Results.ValidationProblem(ex.Errors.ToDictionary(pair => pair.Key, pair => pair.Value));
    }
  }
}
