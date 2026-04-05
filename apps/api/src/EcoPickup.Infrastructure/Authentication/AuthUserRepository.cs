using EcoPickup.Application.Authentication.Abstractions;
using EcoPickup.Domain.Identity;
using EcoPickup.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EcoPickup.Infrastructure.Authentication;

public sealed class AuthUserRepository(EcoPickupDbContext dbContext) : IAuthUserRepository
{
  public Task<AuthUser?> GetByEmailAsync(string email, CancellationToken cancellationToken) =>
    dbContext.AuthUsers.SingleOrDefaultAsync(user => user.Email == email, cancellationToken);

  public Task<AuthUser?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
    dbContext.AuthUsers.SingleOrDefaultAsync(user => user.Id == id, cancellationToken);

  public Task AddAsync(AuthUser user, CancellationToken cancellationToken) =>
    dbContext.AuthUsers.AddAsync(user, cancellationToken).AsTask();

  public Task SaveChangesAsync(CancellationToken cancellationToken) =>
    dbContext.SaveChangesAsync(cancellationToken);
}
