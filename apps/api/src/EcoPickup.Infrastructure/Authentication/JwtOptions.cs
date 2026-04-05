using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace EcoPickup.Infrastructure.Authentication;

public sealed class JwtOptions
{
  public const string SectionName = "Jwt";

  public string Issuer { get; set; } = "EcoPickup.Api";

  public string Audience { get; set; } = "EcoPickup.Web";

  public string SigningKey { get; set; } = string.Empty;

  public int AccessTokenLifetimeMinutes { get; set; } = 60;

  public SymmetricSecurityKey CreateSecurityKey()
  {
    if (string.IsNullOrWhiteSpace(SigningKey) || SigningKey.Length < 32)
    {
      throw new InvalidOperationException("JWT signing key must have at least 32 characters.");
    }

    return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SigningKey));
  }
}
