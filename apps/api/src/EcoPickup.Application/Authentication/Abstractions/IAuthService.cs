using EcoPickup.Application.Authentication.Models;

namespace EcoPickup.Application.Authentication.Abstractions;

public interface IAuthService
{
  Task<AuthenticatedUser> RegisterAsync(RegisterUserCommand command, CancellationToken cancellationToken);

  Task<AuthTokenResult> LoginAsync(LoginUserCommand command, CancellationToken cancellationToken);

  Task<AuthenticatedUser?> GetCurrentUserAsync(Guid userId, CancellationToken cancellationToken);
}
