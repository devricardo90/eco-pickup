namespace EcoPickup.Domain.PickupRequests;

public static class PickupItemSizes
{
  public const string Small = "small";
  public const string Medium = "medium";
  public const string Large = "large";

  public static readonly IReadOnlySet<string> All = new HashSet<string>(StringComparer.Ordinal)
  {
    Small,
    Medium,
    Large
  };
}
