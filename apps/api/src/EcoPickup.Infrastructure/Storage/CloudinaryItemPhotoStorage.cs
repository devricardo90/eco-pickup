using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using EcoPickup.Application.PickupRequests.Abstractions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace EcoPickup.Infrastructure.Storage;

public sealed class CloudinaryItemPhotoStorage : IItemPhotoStorage
{
  private readonly Cloudinary cloudinary;
  private readonly CloudinaryOptions options;
  private readonly ILogger<CloudinaryItemPhotoStorage> logger;

  public CloudinaryItemPhotoStorage(
    IOptions<CloudinaryOptions> optionsAccessor,
    ILogger<CloudinaryItemPhotoStorage> logger)
  {
    this.logger = logger;
    options = optionsAccessor.Value;
    Validate(options);

    var account = new Account(options.CloudName, options.ApiKey, options.ApiSecret);
    cloudinary = new Cloudinary(account) { Api = { Secure = true } };

    logger.LogInformation(
      "[CLOUDINARY-STORAGE] Configured. CloudName={CloudName} Folder={Folder}",
      options.CloudName,
      options.Folder);
  }

  public async Task<string> SaveAsync(
    string key,
    string contentType,
    byte[] content,
    CancellationToken cancellationToken)
  {
    var publicId = string.IsNullOrWhiteSpace(options.Folder)
      ? key
      : $"{options.Folder.TrimEnd('/')}/{key}";

    await using var stream = new MemoryStream(content);
    var uploadParams = new ImageUploadParams
    {
      File = new FileDescription(key, stream),
      PublicId = publicId,
      Overwrite = false,
      UniqueFilename = false
    };

    ImageUploadResult result;
    try
    {
      result = await cloudinary.UploadAsync(uploadParams, cancellationToken);
    }
    catch (Exception ex)
    {
      logger.LogError(
        ex,
        "[CLOUDINARY-STORAGE] Upload failed. PublicId={PublicId} Message={Message}",
        publicId,
        ex.Message);
      throw;
    }

    if (result.Error is not null)
    {
      logger.LogError(
        "[CLOUDINARY-STORAGE] Upload rejected. PublicId={PublicId} ErrorMessage={ErrorMessage}",
        publicId,
        result.Error.Message);
      throw new InvalidOperationException($"Cloudinary upload failed: {result.Error.Message}");
    }

    logger.LogInformation(
      "[CLOUDINARY-STORAGE] Upload succeeded. PublicId={PublicId} SecureUrl={SecureUrl} Bytes={Bytes}",
      result.PublicId,
      result.SecureUrl,
      content.Length);

    return result.SecureUrl.ToString();
  }

  public async Task DeleteAsync(string key, CancellationToken cancellationToken)
  {
    if (string.IsNullOrWhiteSpace(key))
    {
      return;
    }

    var publicId = ExtractPublicId(key);

    try
    {
      var result = await cloudinary.DestroyAsync(new DeletionParams(publicId));
      if (!string.Equals(result.Result, "ok", StringComparison.OrdinalIgnoreCase) &&
          !string.Equals(result.Result, "not found", StringComparison.OrdinalIgnoreCase))
      {
        logger.LogWarning(
          "[CLOUDINARY-STORAGE] Best effort cleanup returned unexpected result. PublicId={PublicId} Result={Result}",
          publicId,
          result.Result);
      }
    }
    catch (Exception ex)
    {
      logger.LogWarning(
        ex,
        "[CLOUDINARY-STORAGE] Best effort cleanup failed. PublicId={PublicId} Message={Message}",
        publicId,
        ex.Message);
      // Best effort cleanup when metadata persistence fails after object upload.
    }
  }

  // Extracts the public_id from a Cloudinary secure URL.
  // Format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{public_id}.{ext}
  //      or https://res.cloudinary.com/{cloud}/image/upload/{public_id}.{ext}
  private static string ExtractPublicId(string key)
  {
    const string uploadSegment = "/image/upload/";
    var uploadIndex = key.IndexOf(uploadSegment, StringComparison.OrdinalIgnoreCase);
    if (uploadIndex < 0)
    {
      // Not a Cloudinary URL - treat key as-is (e.g. during tests or legacy data).
      return key;
    }

    var afterUpload = key[(uploadIndex + uploadSegment.Length)..];

    // Skip optional version segment: v1234567890/
    if (afterUpload.StartsWith('v') && afterUpload.Length > 1 && char.IsDigit(afterUpload[1]))
    {
      var slash = afterUpload.IndexOf('/');
      if (slash >= 0)
      {
        afterUpload = afterUpload[(slash + 1)..];
      }
    }

    // Strip file extension
    var dot = afterUpload.LastIndexOf('.');
    return dot >= 0 ? afterUpload[..dot] : afterUpload;
  }

  private static void Validate(CloudinaryOptions options)
  {
    if (string.IsNullOrWhiteSpace(options.CloudName))
    {
      throw new InvalidOperationException("Cloudinary cloud name is required.");
    }

    if (string.IsNullOrWhiteSpace(options.ApiKey))
    {
      throw new InvalidOperationException("Cloudinary API key is required.");
    }

    if (string.IsNullOrWhiteSpace(options.ApiSecret))
    {
      throw new InvalidOperationException("Cloudinary API secret is required.");
    }
  }
}
