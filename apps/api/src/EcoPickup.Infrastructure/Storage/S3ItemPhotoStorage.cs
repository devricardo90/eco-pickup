using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Util;
using EcoPickup.Application.PickupRequests.Abstractions;
using Microsoft.Extensions.Options;

namespace EcoPickup.Infrastructure.Storage;

public sealed class S3ItemPhotoStorage : IItemPhotoStorage
{
  private readonly IAmazonS3 s3Client;
  private readonly ObjectStorageOptions options;
  private readonly SemaphoreSlim bucketLock = new(1, 1);
  private volatile bool bucketEnsured;

  public S3ItemPhotoStorage(IOptions<ObjectStorageOptions> optionsAccessor)
  {
    options = optionsAccessor.Value;
    Validate(options);

    var config = new AmazonS3Config
    {
      ServiceURL = options.ServiceUrl,
      ForcePathStyle = options.ForcePathStyle,
      AuthenticationRegion = options.Region,
      UseHttp = options.ServiceUrl.StartsWith("http://", StringComparison.OrdinalIgnoreCase)
    };

    s3Client = new AmazonS3Client(
      new BasicAWSCredentials(options.AccessKey, options.SecretKey),
      config);
  }

  public async Task SaveAsync(string key, string contentType, byte[] content, CancellationToken cancellationToken)
  {
    await EnsureBucketExistsAsync(cancellationToken);

    await using var stream = new MemoryStream(content);
    var request = new PutObjectRequest
    {
      BucketName = options.BucketName,
      Key = key,
      InputStream = stream,
      ContentType = contentType
    };

    await s3Client.PutObjectAsync(request, cancellationToken);
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
    catch
    {
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
        if (!options.AutoCreateBucket)
        {
          throw new InvalidOperationException($"Object storage bucket '{options.BucketName}' does not exist.");
        }

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
}
