using EcoPickup.Domain.Identity;

namespace EcoPickup.Application.Authentication.Abstractions;

public interface IAuthUserRepository
{
  Task<AuthUser?> GetByEmailAsync(string email, CancellationToken cancellationToken);

  Task<AuthUser?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

  Task AddAsync(AuthUser user, CancellationToken cancellationToken);

  Task SaveChangesAsync(CancellationToken cancellationToken);
}
