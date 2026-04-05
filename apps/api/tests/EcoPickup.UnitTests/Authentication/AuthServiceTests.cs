using EcoPickup.Application.Authentication;
using EcoPickup.Application.Authentication.Abstractions;
using EcoPickup.Application.Authentication.Exceptions;
using EcoPickup.Application.Authentication.Models;
using EcoPickup.Domain.Identity;
using Xunit;

namespace EcoPickup.UnitTests.Authentication;

public sealed class AuthServiceTests
{
  [Fact]
  public async Task RegisterAsync_ShouldCreateUserWithUserRole()
  {
    var repository = new InMemoryAuthUserRepository();
    var service = new AuthService(repository, new FakePasswordHashService(), new FakeAccessTokenService());

    var user = await service.RegisterAsync(
      new RegisterUserCommand("user@example.com", "strongpass"),
      CancellationToken.None);

    Assert.Equal("user@example.com", user.Email);
    Assert.Equal(IdentityRoles.User, user.Role);
  }

  [Fact]
  public async Task LoginAsync_ShouldThrowWhenPasswordIsInvalid()
  {
    var repository = new InMemoryAuthUserRepository();
    await repository.AddAsync(new AuthUser
    {
      Id = Guid.NewGuid(),
      Email = "user@example.com",
      PasswordHash = "hashed:correctpass",
      Role = IdentityRoles.User,
      CreatedUtc = DateTime.UtcNow
    }, CancellationToken.None);

    var service = new AuthService(repository, new FakePasswordHashService(), new FakeAccessTokenService());

    await Assert.ThrowsAsync<AuthUnauthorizedException>(() =>
      service.LoginAsync(new LoginUserCommand("user@example.com", "wrongpass"), CancellationToken.None));
  }

  private sealed class InMemoryAuthUserRepository : IAuthUserRepository
  {
    private readonly List<AuthUser> _users = [];

    public Task<AuthUser?> GetByEmailAsync(string email, CancellationToken cancellationToken) =>
      Task.FromResult(_users.SingleOrDefault(x => x.Email == email));

    public Task<AuthUser?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
      Task.FromResult(_users.SingleOrDefault(x => x.Id == id));

    public Task AddAsync(AuthUser user, CancellationToken cancellationToken)
    {
      _users.Add(user);
      return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
      Task.CompletedTask;
  }

  private sealed class FakePasswordHashService : IPasswordHashService
  {
    public string Hash(string password) => $"hashed:{password}";

    public bool Verify(string password, string passwordHash) =>
      passwordHash == $"hashed:{password}";
  }

  private sealed class FakeAccessTokenService : IAccessTokenService
  {
    public AuthTokenResult GenerateToken(AuthUser user) =>
      new(
        "token",
        "Bearer",
        DateTime.UtcNow.AddMinutes(60),
        new AuthenticatedUser(user.Id, user.Email, user.Role, user.CreatedUtc));
  }
}
