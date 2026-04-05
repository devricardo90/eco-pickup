using Microsoft.Extensions.Options;

namespace EcoPickup.Infrastructure.Authentication;

public sealed class JwtOptionsValidator : IValidateOptions<JwtOptions>
{
  public ValidateOptionsResult Validate(string? name, JwtOptions options)
  {
    if (string.IsNullOrWhiteSpace(options.Issuer))
    {
      return ValidateOptionsResult.Fail("Jwt issuer is required.");
    }

    if (string.IsNullOrWhiteSpace(options.Audience))
    {
      return ValidateOptionsResult.Fail("Jwt audience is required.");
    }

    if (string.IsNullOrWhiteSpace(options.SigningKey) || options.SigningKey.Length < 32)
    {
      return ValidateOptionsResult.Fail("Jwt signing key must have at least 32 characters.");
    }

    if (options.AccessTokenLifetimeMinutes <= 0)
    {
      return ValidateOptionsResult.Fail("Jwt access token lifetime must be greater than zero.");
    }

    return ValidateOptionsResult.Success;
  }
}
