namespace EcoPickup.Domain.Identity;

public sealed class AuthUser
{
  public Guid Id { get; set; }

  public string Email { get; set; } = string.Empty;

  public string PasswordHash { get; set; } = string.Empty;

  public string Role { get; set; } = IdentityRoles.User;

  public DateTime CreatedUtc { get; set; }
}
