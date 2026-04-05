using EcoPickup.Application.PickupRequests.Abstractions;
using EcoPickup.Application.PickupRequests.Exceptions;
using EcoPickup.Application.PickupRequests.Models;
using EcoPickup.Domain.PickupRequests;

namespace EcoPickup.Application.PickupRequests;

public sealed class PickupRequestService(IPickupRequestRepository pickupRequestRepository) : IPickupRequestService
{
  public async Task<PickupRequestResult> SetSchedulingAsync(
    Guid id,
    Guid adminUserId,
    SetPickupRequestSchedulingCommand command,
    CancellationToken cancellationToken)
  {
    var errors = new Dictionary<string, string[]>();

    if (id == Guid.Empty)
    {
      errors["id"] = ["Pickup request id is required."];
    }

    if (adminUserId == Guid.Empty)
    {
      errors["adminUserId"] = ["Authenticated admin user is required."];
    }

    var confirmedStartUtc = EnsureUtc(command.ConfirmedPickupWindowStartUtc);
    var confirmedEndUtc = EnsureUtc(command.ConfirmedPickupWindowEndUtc);

    if (confirmedStartUtc <= DateTime.UtcNow)
    {
      errors["confirmedPickupWindowStartUtc"] = ["Confirmed pickup window start must be in the future."];
    }

    if (confirmedEndUtc <= confirmedStartUtc)
    {
      errors["confirmedPickupWindowEndUtc"] = ["Confirmed pickup window end must be after start."];
    }

    var normalizedNote = NormalizeOptional(command.Note);
    if (normalizedNote is not null && normalizedNote.Length > 1000)
    {
      errors["note"] = ["Note must be 1000 characters or fewer."];
    }

    if (errors.Count > 0)
    {
      throw new PickupRequestValidationException(errors);
    }

    var pickupRequest = await pickupRequestRepository.GetTrackedByIdAsync(id, cancellationToken);
    if (pickupRequest is null)
    {
      throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["id"] = ["Pickup request was not found."]
      });
    }

    var nextStatus = ResolveNextSchedulingStatus(pickupRequest.Status);
    pickupRequest.ConfirmedPickupWindowStartUtc = confirmedStartUtc;
    pickupRequest.ConfirmedPickupWindowEndUtc = confirmedEndUtc;
    pickupRequest.StatusHistory.Add(new PickupRequestStatusHistory
    {
      Id = Guid.NewGuid(),
      PickupRequestId = pickupRequest.Id,
      FromStatus = pickupRequest.Status,
      ToStatus = nextStatus,
      Action = "scheduling",
      ActorUserId = adminUserId,
      Note = normalizedNote,
      CreatedUtc = DateTime.UtcNow
    });
    pickupRequest.Status = nextStatus;

    await pickupRequestRepository.SaveChangesAsync(cancellationToken);

    var refreshedPickupRequest = await pickupRequestRepository.GetByIdForAdminAsync(id, cancellationToken)
      ?? throw new InvalidOperationException("Pickup request should exist after scheduling.");

    return ToResult(refreshedPickupRequest);
  }

  public async Task<PickupRequestResult> SetPricingAsync(
    Guid id,
    Guid adminUserId,
    SetPickupRequestPricingCommand command,
    CancellationToken cancellationToken)
  {
    var errors = new Dictionary<string, string[]>();

    if (id == Guid.Empty)
    {
      errors["id"] = ["Pickup request id is required."];
    }

    if (adminUserId == Guid.Empty)
    {
      errors["adminUserId"] = ["Authenticated admin user is required."];
    }

    if (command.BasePrice < 0)
    {
      errors["basePrice"] = ["Base price must be zero or greater."];
    }

    if (command.SizeAdjustment < 0)
    {
      errors["sizeAdjustment"] = ["Size adjustment must be zero or greater."];
    }

    if (command.FloorAdjustment < 0)
    {
      errors["floorAdjustment"] = ["Floor adjustment must be zero or greater."];
    }

    if (command.DistanceAdjustment < 0)
    {
      errors["distanceAdjustment"] = ["Distance adjustment must be zero or greater."];
    }

    var normalizedCurrency = command.Currency.Trim().ToUpperInvariant();
    if (normalizedCurrency.Length != 3)
    {
      errors["currency"] = ["Currency must be a 3-letter ISO code."];
    }

    var targetStatus = command.TargetStatus.Trim().ToLowerInvariant();
    if (!PickupRequestPricingStatuses.IsSupportedTarget(targetStatus))
    {
      errors["targetStatus"] = ["Target status must be one of: quoted, awaiting_payment."];
    }

    var normalizedNote = NormalizeOptional(command.Note);
    if (normalizedNote is not null && normalizedNote.Length > 1000)
    {
      errors["note"] = ["Note must be 1000 characters or fewer."];
    }

    if (errors.Count > 0)
    {
      throw new PickupRequestValidationException(errors);
    }

    var pickupRequest = await pickupRequestRepository.GetTrackedByIdAsync(id, cancellationToken);
    if (pickupRequest is null)
    {
      throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["id"] = ["Pickup request was not found."]
      });
    }

    var nextStatus = ResolveNextPricingStatus(pickupRequest.Status, targetStatus);
    var total = command.BasePrice + command.SizeAdjustment + command.FloorAdjustment + command.DistanceAdjustment;

    pickupRequest.PriceBase = command.BasePrice;
    pickupRequest.PriceSizeAdjustment = command.SizeAdjustment;
    pickupRequest.PriceFloorAdjustment = command.FloorAdjustment;
    pickupRequest.PriceDistanceAdjustment = command.DistanceAdjustment;
    pickupRequest.PriceTotal = total;
    pickupRequest.PriceCurrency = normalizedCurrency;
    pickupRequest.StatusHistory.Add(new PickupRequestStatusHistory
    {
      Id = Guid.NewGuid(),
      PickupRequestId = pickupRequest.Id,
      FromStatus = pickupRequest.Status,
      ToStatus = nextStatus,
      Action = "pricing",
      ActorUserId = adminUserId,
      Note = normalizedNote,
      CreatedUtc = DateTime.UtcNow
    });
    pickupRequest.Status = nextStatus;

    await pickupRequestRepository.SaveChangesAsync(cancellationToken);

    var refreshedPickupRequest = await pickupRequestRepository.GetByIdForAdminAsync(id, cancellationToken)
      ?? throw new InvalidOperationException("Pickup request should exist after pricing.");

    return ToResult(refreshedPickupRequest);
  }

  public async Task<PickupRequestResult> ReviewAsync(
    Guid id,
    Guid adminUserId,
    ReviewPickupRequestCommand command,
    CancellationToken cancellationToken)
  {
    var errors = new Dictionary<string, string[]>();

    if (id == Guid.Empty)
    {
      errors["id"] = ["Pickup request id is required."];
    }

    if (adminUserId == Guid.Empty)
    {
      errors["adminUserId"] = ["Authenticated admin user is required."];
    }

    var decision = command.Decision.Trim().ToLowerInvariant();
    if (!PickupRequestReviewDecisions.IsSupported(decision))
    {
      errors["decision"] = ["Decision must be one of: approve, reject."];
    }

    var normalizedNote = NormalizeOptional(command.Note);
    if (normalizedNote is not null && normalizedNote.Length > 1000)
    {
      errors["note"] = ["Note must be 1000 characters or fewer."];
    }

    if (errors.Count > 0)
    {
      throw new PickupRequestValidationException(errors);
    }

    var pickupRequest = await pickupRequestRepository.GetTrackedByIdAsync(id, cancellationToken);
    if (pickupRequest is null)
    {
      throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["id"] = ["Pickup request was not found."]
      });
    }

    var nextStatus = ResolveNextReviewStatus(pickupRequest.Status, decision);
    pickupRequest.StatusHistory.Add(new PickupRequestStatusHistory
    {
      Id = Guid.NewGuid(),
      PickupRequestId = pickupRequest.Id,
      FromStatus = pickupRequest.Status,
      ToStatus = nextStatus,
      Action = decision,
      ActorUserId = adminUserId,
      Note = normalizedNote,
      CreatedUtc = DateTime.UtcNow
    });
    pickupRequest.Status = nextStatus;

    await pickupRequestRepository.SaveChangesAsync(cancellationToken);

    var refreshedPickupRequest = await pickupRequestRepository.GetByIdForAdminAsync(id, cancellationToken)
      ?? throw new InvalidOperationException("Pickup request should exist after review.");

    return ToResult(refreshedPickupRequest);
  }

  public async Task<IReadOnlyList<PickupRequestResult>> GetAllForAdminAsync(
    CancellationToken cancellationToken)
  {
    var pickupRequests = await pickupRequestRepository.GetAllAsync(cancellationToken);
    return pickupRequests.Select(ToResult).ToArray();
  }

  public async Task<PickupRequestResult?> GetByIdForAdminAsync(
    Guid id,
    CancellationToken cancellationToken)
  {
    if (id == Guid.Empty)
    {
      throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["id"] = ["Pickup request id is required."]
      });
    }

    var pickupRequest = await pickupRequestRepository.GetByIdForAdminAsync(id, cancellationToken);
    return pickupRequest is null ? null : ToResult(pickupRequest);
  }

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

  private static string ResolveNextReviewStatus(string currentStatus, string decision) =>
    (currentStatus, decision) switch
    {
      (PickupRequestStatuses.Draft, PickupRequestReviewDecisions.Approve) => PickupRequestStatuses.UnderReview,
      (PickupRequestStatuses.Draft, PickupRequestReviewDecisions.Reject) => PickupRequestStatuses.Rejected,
      (PickupRequestStatuses.UnderReview, PickupRequestReviewDecisions.Reject) => PickupRequestStatuses.Rejected,
      _ => throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["status"] = [$"Decision '{decision}' is not allowed when request status is '{currentStatus}'."]
      })
    };

  private static string ResolveNextPricingStatus(string currentStatus, string targetStatus) =>
    (currentStatus, targetStatus) switch
    {
      (PickupRequestStatuses.UnderReview, PickupRequestStatuses.Quoted) => PickupRequestStatuses.Quoted,
      (PickupRequestStatuses.UnderReview, PickupRequestStatuses.AwaitingPayment) => PickupRequestStatuses.AwaitingPayment,
      _ => throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["status"] = [$"Target status '{targetStatus}' is not allowed when request status is '{currentStatus}'."]
      })
    };

  private static string ResolveNextSchedulingStatus(string currentStatus) =>
    PickupRequestSchedulingStatuses.CanScheduleFrom(currentStatus)
      ? PickupRequestStatuses.Scheduled
      : throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["status"] = [$"Scheduling is not allowed when request status is '{currentStatus}'."]
      });

  private static PickupRequestResult ToResult(PickupRequest pickupRequest) =>
    new(
      pickupRequest.Id,
      pickupRequest.UserId,
      pickupRequest.Description,
      pickupRequest.Status,
      pickupRequest.PriceTotal is null || pickupRequest.PriceBase is null || pickupRequest.PriceSizeAdjustment is null || pickupRequest.PriceFloorAdjustment is null || pickupRequest.PriceDistanceAdjustment is null || string.IsNullOrWhiteSpace(pickupRequest.PriceCurrency)
        ? null
        : new PickupRequestPricingResult(
          pickupRequest.PriceBase.Value,
          pickupRequest.PriceSizeAdjustment.Value,
          pickupRequest.PriceFloorAdjustment.Value,
          pickupRequest.PriceDistanceAdjustment.Value,
          pickupRequest.PriceTotal.Value,
          pickupRequest.PriceCurrency),
      pickupRequest.ConfirmedPickupWindowStartUtc is null || pickupRequest.ConfirmedPickupWindowEndUtc is null
        ? null
        : new PickupRequestSchedulingResult(
          pickupRequest.ConfirmedPickupWindowStartUtc.Value,
          pickupRequest.ConfirmedPickupWindowEndUtc.Value),
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
