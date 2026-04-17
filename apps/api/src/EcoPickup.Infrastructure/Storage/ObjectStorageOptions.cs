namespace EcoPickup.Infrastructure.Storage;

public sealed class ObjectStorageOptions
{
  public const string SectionName = "ObjectStorage";

  public string ServiceUrl { get; set; } = string.Empty;

  public string BucketName { get; set; } = string.Empty;

  public string AccessKey { get; set; } = string.Empty;

  public string SecretKey { get; set; } = string.Empty;

  public string Region { get; set; } = "us-east-1";

  public bool ForcePathStyle { get; set; } = true;

  public bool AutoCreateBucket { get; set; } = false;
}
