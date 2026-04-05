using EcoPickup.Application.PickupRequests.Abstractions;
using EcoPickup.Application.PickupRequests.Exceptions;
using EcoPickup.Application.PickupRequests.Models;
using EcoPickup.Domain.PickupRequests;

namespace EcoPickup.Application.PickupRequests;

public sealed class PickupRequestService(IPickupRequestRepository pickupRequestRepository) : IPickupRequestService
{
  public async Task<IReadOnlyList<PickupRequestResult>> GetByUserAsync(
    Guid userId,
    CancellationToken cancellationToken)
  {
    if (userId == Guid.Empty)
    {
      throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["userId"] = ["Authenticated user is required."]
      });
    }

    var pickupRequests = await pickupRequestRepository.GetByUserIdAsync(userId, cancellationToken);
    return pickupRequests.Select(ToResult).ToArray();
  }

  public async Task<PickupRequestResult?> GetByIdAsync(
    Guid id,
    Guid userId,
    CancellationToken cancellationToken)
  {
    if (id == Guid.Empty)
    {
      throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["id"] = ["Pickup request id is required."]
      });
    }

    if (userId == Guid.Empty)
    {
      throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["userId"] = ["Authenticated user is required."]
      });
    }

    var pickupRequest = await pickupRequestRepository.GetByIdAsync(id, userId, cancellationToken);
    return pickupRequest is null ? null : ToResult(pickupRequest);
  }

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
      },
      Items = command.Items
        .Select(item => new PickupItem
        {
          Id = Guid.NewGuid(),
          Category = item.Category.Trim(),
          Description = item.Description.Trim(),
          EstimatedSize = NormalizeEstimatedSize(item.EstimatedSize),
          CreatedUtc = DateTime.UtcNow
        })
        .ToList()
    };
    pickupRequest.Address.PickupRequestId = pickupRequest.Id;
    foreach (var item in pickupRequest.Items)
    {
      item.PickupRequestId = pickupRequest.Id;
    }

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

    if (command.Items.Count == 0)
    {
      errors["items"] = ["At least one item is required."];
    }

    for (var index = 0; index < command.Items.Count; index++)
    {
      var item = command.Items[index];

      if (string.IsNullOrWhiteSpace(item.Category))
      {
        errors[$"items[{index}].category"] = ["Item category is required."];
      }

      if (string.IsNullOrWhiteSpace(item.Description))
      {
        errors[$"items[{index}].description"] = ["Item description is required."];
      }

      if (string.IsNullOrWhiteSpace(item.EstimatedSize))
      {
        errors[$"items[{index}].estimatedSize"] = ["Item estimated size is required."];
      }
      else if (!PickupItemSizes.All.Contains(item.EstimatedSize.Trim().ToLowerInvariant()))
      {
        errors[$"items[{index}].estimatedSize"] = ["Item estimated size must be one of: small, medium, large."];
      }
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

  private static string NormalizeEstimatedSize(string estimatedSize) =>
    estimatedSize.Trim().ToLowerInvariant();

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
        pickupRequest.Address.AccessNotes),
      pickupRequest.Items
        .OrderBy(item => item.CreatedUtc)
        .Select(item => new PickupItemResult(
          item.Id,
          item.Category,
          item.Description,
          item.EstimatedSize,
          item.CreatedUtc,
          item.Photos
            .OrderBy(photo => photo.CreatedUtc)
            .Select(photo => new PickupItemPhotoResult(
              photo.Id,
              photo.StorageKey,
              photo.OriginalFileName,
              photo.ContentType,
              photo.SizeBytes,
              photo.CreatedUtc))
            .ToArray()))
        .ToArray());
}
