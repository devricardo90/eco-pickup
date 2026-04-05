using EcoPickup.Application.PickupRequests.Abstractions;
using EcoPickup.Application.PickupRequests.Exceptions;
using EcoPickup.Application.PickupRequests.Models;
using EcoPickup.Domain.PickupRequests;

namespace EcoPickup.Application.PickupRequests;

public sealed class PickupRequestService(IPickupRequestRepository pickupRequestRepository) : IPickupRequestService
{
  public async Task<PickupRequestResult> CreateAsync(
    Guid userId,
    CreatePickupRequestCommand command,
    CancellationToken cancellationToken)
  {
    Validate(userId, command);

    var pickupRequest = new PickupRequest
    {
      Id = Guid.NewGuid(),
      UserId = userId,
      Description = command.Description.Trim(),
      PickupWindowStartUtc = EnsureUtc(command.PickupWindowStartUtc),
      PickupWindowEndUtc = EnsureUtc(command.PickupWindowEndUtc),
      Status = PickupRequestStatuses.Draft,
      CreatedUtc = DateTime.UtcNow,
      Address = new Address
      {
        Id = Guid.NewGuid(),
        Street = command.Address.Street.Trim(),
        City = command.Address.City.Trim(),
        PostalCode = command.Address.PostalCode.Trim(),
        Floor = NormalizeOptional(command.Address.Floor),
        HasElevator = command.Address.HasElevator,
        AccessNotes = NormalizeOptional(command.Address.AccessNotes)
      }
    };
    pickupRequest.Address.PickupRequestId = pickupRequest.Id;

    await pickupRequestRepository.AddAsync(pickupRequest, cancellationToken);
    await pickupRequestRepository.SaveChangesAsync(cancellationToken);

    return ToResult(pickupRequest);
  }

  private static void Validate(Guid userId, CreatePickupRequestCommand command)
  {
    var errors = new Dictionary<string, string[]>();

    if (userId == Guid.Empty)
    {
      errors["userId"] = ["Authenticated user is required."];
    }

    if (string.IsNullOrWhiteSpace(command.Description))
    {
      errors["description"] = ["Description is required."];
    }

    if (string.IsNullOrWhiteSpace(command.Address.Street))
    {
      errors["address.street"] = ["Street is required."];
    }

    if (string.IsNullOrWhiteSpace(command.Address.City))
    {
      errors["address.city"] = ["City is required."];
    }

    if (string.IsNullOrWhiteSpace(command.Address.PostalCode))
    {
      errors["address.postalCode"] = ["Postal code is required."];
    }

    var pickupWindowStartUtc = EnsureUtc(command.PickupWindowStartUtc);
    var pickupWindowEndUtc = EnsureUtc(command.PickupWindowEndUtc);

    if (pickupWindowStartUtc <= DateTime.UtcNow)
    {
      errors["pickupWindowStartUtc"] = ["Pickup window start must be in the future."];
    }

    if (pickupWindowEndUtc <= pickupWindowStartUtc)
    {
      errors["pickupWindowEndUtc"] = ["Pickup window end must be after start."];
    }

    if (errors.Count > 0)
    {
      throw new PickupRequestValidationException(errors);
    }
  }

  private static DateTime EnsureUtc(DateTime value) =>
    value.Kind switch
    {
      DateTimeKind.Utc => value,
      DateTimeKind.Local => value.ToUniversalTime(),
      _ => DateTime.SpecifyKind(value, DateTimeKind.Utc)
    };

  private static string? NormalizeOptional(string? value) =>
    string.IsNullOrWhiteSpace(value) ? null : value.Trim();

  private static PickupRequestResult ToResult(PickupRequest pickupRequest) =>
    new(
      pickupRequest.Id,
      pickupRequest.UserId,
      pickupRequest.Description,
      pickupRequest.Status,
      pickupRequest.PickupWindowStartUtc,
      pickupRequest.PickupWindowEndUtc,
      pickupRequest.CreatedUtc,
      new PickupRequestAddressResult(
        pickupRequest.Address.Id,
        pickupRequest.Address.Street,
        pickupRequest.Address.City,
        pickupRequest.Address.PostalCode,
        pickupRequest.Address.Floor,
        pickupRequest.Address.HasElevator,
        pickupRequest.Address.AccessNotes));
}
