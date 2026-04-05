namespace EcoPickup.Domain.Identity;

public static class IdentityRoles
{
  public const string User = "USER";

  public const string Admin = "ADMIN";

  public static bool IsSupported(string role) =>
    role is User or Admin;
}
