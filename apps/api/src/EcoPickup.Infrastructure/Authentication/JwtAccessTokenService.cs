using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using EcoPickup.Application.Authentication.Abstractions;
using EcoPickup.Application.Authentication.Models;
using EcoPickup.Domain.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace EcoPickup.Infrastructure.Authentication;

public sealed class JwtAccessTokenService(IOptions<JwtOptions> jwtOptions) : IAccessTokenService
{
  private readonly JwtOptions _jwtOptions = jwtOptions.Value;

  public AuthTokenResult GenerateToken(AuthUser user)
  {
    var now = DateTime.UtcNow;
    var expiresAtUtc = now.AddMinutes(_jwtOptions.AccessTokenLifetimeMinutes);
    var claims = new List<Claim>
    {
      new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
      new(JwtRegisteredClaimNames.Email, user.Email),
      new("role", user.Role),
      new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N"))
    };

    var credentials = new SigningCredentials(_jwtOptions.CreateSecurityKey(), SecurityAlgorithms.HmacSha256);
    var tokenDescriptor = new JwtSecurityToken(
      issuer: _jwtOptions.Issuer,
      audience: _jwtOptions.Audience,
      claims: claims,
      notBefore: now,
      expires: expiresAtUtc,
      signingCredentials: credentials);

    var token = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);

    return new AuthTokenResult(
      token,
      "Bearer",
      expiresAtUtc,
      new AuthenticatedUser(user.Id, user.Email, user.Role, user.CreatedUtc));
  }
}
