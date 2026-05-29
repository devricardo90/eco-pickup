using EcoPickup.Application.PickupRequests.Abstractions;
using EcoPickup.Application.PickupRequests.Exceptions;
using EcoPickup.Application.PickupRequests.Models;
using EcoPickup.Domain.PickupRequests;

namespace EcoPickup.Application.PickupRequests;

public sealed class PickupItemPhotoService(
  IPickupItemPhotoRepository pickupItemPhotoRepository,
  IItemPhotoStorage itemPhotoStorage) : IPickupItemPhotoService
{
  public const long MaxFileSizeBytes = 10 * 1024 * 1024;
  public const int MaxPhotosPerItem = 5;

  private static readonly string[] AllowedContentTypes =
  [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  public async Task<PickupItemPhotoResult?> UploadAsync(
    Guid itemId,
    Guid userId,
    UploadPickupItemPhotoCommand command,
    CancellationToken cancellationToken)
  {
    Validate(itemId, userId, command);

    var pickupItem = await pickupItemPhotoRepository.GetOwnedItemByIdAsync(itemId, userId, cancellationToken);
    if (pickupItem is null)
    {
      return null;
    }

    if (pickupItem.Photos.Count >= MaxPhotosPerItem)
    {
      throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["file"] = [$"A pickup item may have at most {MaxPhotosPerItem} photos."]
      });
    }

    var normalizedContentType = command.ContentType.Trim().ToLowerInvariant();
    var detectedContentType = DetectContentType(command.Content);

    if (detectedContentType is null)
    {
      throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["file"] = ["File signature does not match a supported image type."]
      });
    }

    if (!string.Equals(normalizedContentType, detectedContentType, StringComparison.Ordinal))
    {
      throw new PickupRequestValidationException(new Dictionary<string, string[]>
      {
        ["file"] = ["File content type does not match the uploaded file signature."]
      });
    }

    var photoId = Guid.NewGuid();
    var storageKey = BuildStorageKey(pickupItem.PickupRequestId, pickupItem.Id, photoId, detectedContentType);
    var originalFileName = Path.GetFileName(command.OriginalFileName.Trim());

    var effectiveKey = await itemPhotoStorage.SaveAsync(storageKey, detectedContentType, command.Content, cancellationToken);

    var photo = new ItemPhoto
    {
      Id = photoId,
      PickupItemId = pickupItem.Id,
      StorageKey = effectiveKey,
      OriginalFileName = originalFileName,
      ContentType = detectedContentType,
      SizeBytes = command.Content.LongLength,
      CreatedUtc = DateTime.UtcNow
    };

    try
    {
      await pickupItemPhotoRepository.AddPhotoAsync(photo, cancellationToken);
      await pickupItemPhotoRepository.SaveChangesAsync(cancellationToken);
    }
    catch
    {
      await itemPhotoStorage.DeleteAsync(effectiveKey, cancellationToken);
      throw;
    }

    return ToResult(photo);
  }

  private static void Validate(Guid itemId, Guid userId, UploadPickupItemPhotoCommand command)
  {
    var errors = new Dictionary<string, string[]>();

    if (itemId == Guid.Empty)
    {
      errors["itemId"] = ["Pickup item id is required."];
    }

    if (userId == Guid.Empty)
    {
      errors["userId"] = ["Authenticated user is required."];
    }

    if (string.IsNullOrWhiteSpace(command.OriginalFileName))
    {
      errors["file"] = ["A file name is required."];
    }

    if (string.IsNullOrWhiteSpace(command.ContentType))
    {
      errors["file"] = ["A file content type is required."];
    }
    else if (!AllowedContentTypes.Contains(command.ContentType.Trim().ToLowerInvariant(), StringComparer.Ordinal))
    {
      errors["file"] = ["Supported file content types are: image/jpeg, image/png, image/webp."];
    }

    if (command.Content.Length == 0)
    {
      errors["file"] = ["A non-empty file is required."];
    }
    else if (command.Content.LongLength > MaxFileSizeBytes)
    {
      errors["file"] = [$"File size must be at most {MaxFileSizeBytes} bytes."];
    }

    if (errors.Count > 0)
    {
      throw new PickupRequestValidationException(errors);
    }
  }

  private static string? DetectContentType(byte[] content)
  {
    if (content.Length >= 3 &&
        content[0] == 0xFF &&
        content[1] == 0xD8 &&
        content[2] == 0xFF)
    {
      return "image/jpeg";
    }

    if (content.Length >= 8 &&
        content[0] == 0x89 &&
        content[1] == 0x50 &&
        content[2] == 0x4E &&
        content[3] == 0x47 &&
        content[4] == 0x0D &&
        content[5] == 0x0A &&
        content[6] == 0x1A &&
        content[7] == 0x0A)
    {
      return "image/png";
    }

    if (content.Length >= 12 &&
        content[0] == 0x52 &&
        content[1] == 0x49 &&
        content[2] == 0x46 &&
        content[3] == 0x46 &&
        content[8] == 0x57 &&
        content[9] == 0x45 &&
        content[10] == 0x42 &&
        content[11] == 0x50)
    {
      return "image/webp";
    }

    return null;
  }

  private static string BuildStorageKey(Guid pickupRequestId, Guid pickupItemId, Guid photoId, string contentType) =>
    $"pickup-requests/{pickupRequestId}/items/{pickupItemId}/photos/{photoId}.{GetExtension(contentType)}";

  private static string GetExtension(string contentType) =>
    contentType switch
    {
      "image/jpeg" => "jpg",
      "image/png" => "png",
      "image/webp" => "webp",
      _ => throw new InvalidOperationException($"Unsupported content type '{contentType}'.")
    };

  private static PickupItemPhotoResult ToResult(ItemPhoto photo) =>
    new(
      photo.Id,
      photo.StorageKey,
      photo.OriginalFileName,
      photo.ContentType,
      photo.SizeBytes,
      photo.CreatedUtc);
}
