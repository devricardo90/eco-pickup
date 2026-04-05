namespace EcoPickup.Application.PickupRequests.Models;

public sealed record UploadPickupItemPhotoCommand(
  string OriginalFileName,
  string ContentType,
  byte[] Content);
