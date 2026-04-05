using EcoPickup.Application.Authentication.Models;
using EcoPickup.Domain.Identity;

namespace EcoPickup.Application.Authentication.Abstractions;

public interface IAccessTokenService
{
  AuthTokenResult GenerateToken(AuthUser user);
}
