namespace EcoPickup.Application.PickupRequests.Models;

public sealed record PickupItemPhotoResult(
  Guid Id,
  string StorageKey,
  string OriginalFileName,
  string ContentType,
  long SizeBytes,
  DateTime CreatedUtc);
