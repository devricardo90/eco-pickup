using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Util;
using EcoPickup.Application.PickupRequests.Abstractions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace EcoPickup.Infrastructure.Storage;

public sealed class S3ItemPhotoStorage : IItemPhotoStorage
{
  private readonly IAmazonS3 s3Client;
  private readonly ILogger<S3ItemPhotoStorage> logger;
  private readonly ObjectStorageOptions options;
  private readonly bool shouldEnsureBucket;
  private readonly SemaphoreSlim bucketLock = new(1, 1);
  private volatile bool bucketEnsured;

  public S3ItemPhotoStorage(
    IOptions<ObjectStorageOptions> optionsAccessor,
    IHostEnvironment hostEnvironment,
    ILogger<S3ItemPhotoStorage> logger)
  {
    this.logger = logger;
    options = optionsAccessor.Value;
    Validate(options);
    shouldEnsureBucket = hostEnvironment.IsDevelopment() && options.AutoCreateBucket;

    logger.LogInformation(
      "[OBJECT-STORAGE] Configured. Environment={EnvironmentName} Bucket={BucketName} Endpoint={ServiceUrl} Region={Region} ForcePathStyle={ForcePathStyle} AutoCreateBucket={AutoCreateBucket} RuntimeBucketEnsureEnabled={RuntimeBucketEnsureEnabled}",
      hostEnvironment.EnvironmentName,
      options.BucketName,
      options.ServiceUrl,
      options.Region,
      options.ForcePathStyle,
      options.AutoCreateBucket,
      shouldEnsureBucket);

    var config = new AmazonS3Config
    {
      ServiceURL = options.ServiceUrl,
      ForcePathStyle = options.ForcePathStyle,
      AuthenticationRegion = options.Region,
      SignatureVersion = "4",
      RequestChecksumCalculation = Amazon.Runtime.RequestChecksumCalculation.WHEN_REQUIRED,
      UseHttp = options.ServiceUrl.StartsWith("http://", StringComparison.OrdinalIgnoreCase)
    };

    s3Client = new AmazonS3Client(
      new BasicAWSCredentials(options.AccessKey, options.SecretKey),
      config);
  }

  public async Task SaveAsync(string key, string contentType, byte[] content, CancellationToken cancellationToken)
  {
    if (shouldEnsureBucket)
    {
      await EnsureBucketExistsAsync(cancellationToken);
    }

    await using var stream = new MemoryStream(content);
    var isHttps = options.ServiceUrl.StartsWith("https://", StringComparison.OrdinalIgnoreCase);
    var request = new PutObjectRequest
    {
      BucketName = options.BucketName,
      Key = key,
      InputStream = stream,
      ContentType = contentType,
      UseChunkEncoding = false,
      // DisablePayloadSigning requires HTTPS; for HTTP endpoints (local Minio) keep payload signing enabled.
      DisablePayloadSigning = isHttps,
      DisableDefaultChecksumValidation = true
    };

    try
    {
      await s3Client.PutObjectAsync(request, cancellationToken);
    }
    catch (AmazonS3Exception ex)
    {
      LogS3Failure("upload item photo", ex);
      throw;
    }
    catch (AmazonServiceException ex)
    {
      logger.LogError(
        ex,
        "[OBJECT-STORAGE] Failed to upload item photo. Category=connection_or_service_error Bucket={BucketName} Endpoint={ServiceUrl} Message={Message}",
        options.BucketName,
        options.ServiceUrl,
        ex.Message);
      throw;
    }
    catch (HttpRequestException ex)
    {
      logger.LogError(
        ex,
        "[OBJECT-STORAGE] Failed to upload item photo. Category=connection_error Bucket={BucketName} Endpoint={ServiceUrl} Message={Message}",
        options.BucketName,
        options.ServiceUrl,
        ex.Message);
      throw;
    }
  }

  public async Task DeleteAsync(string key, CancellationToken cancellationToken)
  {
    if (string.IsNullOrWhiteSpace(key))
    {
      return;
    }

    try
    {
      await s3Client.DeleteObjectAsync(options.BucketName, key, cancellationToken);
    }
    catch (Exception ex)
    {
      logger.LogWarning(
        ex,
        "[OBJECT-STORAGE] Best effort cleanup failed. Bucket={BucketName} Key={StorageKey} Message={Message}",
        options.BucketName,
        key,
        ex.Message);
      // Best effort cleanup when metadata persistence fails after object upload.
    }
  }

  private async Task EnsureBucketExistsAsync(CancellationToken cancellationToken)
  {
    if (bucketEnsured)
    {
      return;
    }

    await bucketLock.WaitAsync(cancellationToken);
    try
    {
      if (bucketEnsured)
      {
        return;
      }

      var exists = await AmazonS3Util.DoesS3BucketExistV2Async(s3Client, options.BucketName);
      if (!exists)
      {
        logger.LogWarning(
          "[OBJECT-STORAGE] Bucket does not exist and AutoCreateBucket=true. Creating bucket. Bucket={BucketName} Endpoint={ServiceUrl}",
          options.BucketName,
          options.ServiceUrl);
        await s3Client.PutBucketAsync(
          new PutBucketRequest
          {
            BucketName = options.BucketName,
            UseClientRegion = true
          },
          cancellationToken);
      }

      bucketEnsured = true;
    }
    catch (AmazonS3Exception ex)
    {
      LogS3Failure("ensure bucket exists", ex);
      throw;
    }
    catch (AmazonServiceException ex)
    {
      logger.LogError(
        ex,
        "[OBJECT-STORAGE] Failed to ensure bucket exists. Category=connection_or_service_error Bucket={BucketName} Endpoint={ServiceUrl} Message={Message}",
        options.BucketName,
        options.ServiceUrl,
        ex.Message);
      throw;
    }
    catch (HttpRequestException ex)
    {
      logger.LogError(
        ex,
        "[OBJECT-STORAGE] Failed to ensure bucket exists. Category=connection_error Bucket={BucketName} Endpoint={ServiceUrl} Message={Message}",
        options.BucketName,
        options.ServiceUrl,
        ex.Message);
      throw;
    }
    finally
    {
      bucketLock.Release();
    }
  }

  private static void Validate(ObjectStorageOptions options)
  {
    if (string.IsNullOrWhiteSpace(options.ServiceUrl))
    {
      throw new InvalidOperationException("Object storage service URL is required.");
    }

    if (string.IsNullOrWhiteSpace(options.BucketName))
    {
      throw new InvalidOperationException("Object storage bucket name is required.");
    }

    if (string.IsNullOrWhiteSpace(options.AccessKey))
    {
      throw new InvalidOperationException("Object storage access key is required.");
    }

    if (string.IsNullOrWhiteSpace(options.SecretKey))
    {
      throw new InvalidOperationException("Object storage secret key is required.");
    }
  }

  private void LogS3Failure(string operation, AmazonS3Exception ex)
  {
    var category = ClassifyS3Failure(ex);

    logger.LogError(
      ex,
      "[OBJECT-STORAGE] Failed to {Operation}. Category={Category} Bucket={BucketName} Endpoint={ServiceUrl} StatusCode={StatusCode} ErrorCode={ErrorCode} Message={Message}",
      operation,
      category,
      options.BucketName,
      options.ServiceUrl,
      ex.StatusCode,
      ex.ErrorCode,
      ex.Message);
  }

  private static string ClassifyS3Failure(AmazonS3Exception ex)
  {
    if (string.Equals(ex.ErrorCode, "NoSuchBucket", StringComparison.OrdinalIgnoreCase) ||
      string.Equals(ex.ErrorCode, "NotFound", StringComparison.OrdinalIgnoreCase))
    {
      return "bucket_missing";
    }

    if (string.Equals(ex.ErrorCode, "InvalidAccessKeyId", StringComparison.OrdinalIgnoreCase) ||
      string.Equals(ex.ErrorCode, "SignatureDoesNotMatch", StringComparison.OrdinalIgnoreCase) ||
      string.Equals(ex.ErrorCode, "AccessDenied", StringComparison.OrdinalIgnoreCase))
    {
      return "credential_or_permission_error";
    }

    if ((int)ex.StatusCode is 401 or 403)
    {
      return "credential_or_permission_error";
    }

    if ((int)ex.StatusCode is 404)
    {
      return "bucket_missing";
    }

    return "s3_service_error";
  }
}
