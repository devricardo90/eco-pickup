using EcoPickup.Application.Authentication.Abstractions;
using EcoPickup.Application.Authentication.Exceptions;
using EcoPickup.Application.Authentication.Models;
using EcoPickup.Domain.Identity;
using System.Net.Mail;

namespace EcoPickup.Application.Authentication;

public sealed class AuthService(
  IAuthUserRepository authUserRepository,
  IPasswordHashService passwordHashService,
  IAccessTokenService accessTokenService) : IAuthService
{
  public async Task<AuthenticatedUser> RegisterAsync(
    RegisterUserCommand command,
    CancellationToken cancellationToken)
  {
    var normalizedEmail = NormalizeEmail(command.Email);
    ValidatePassword(command.Password);

    var existingUser = await authUserRepository.GetByEmailAsync(normalizedEmail, cancellationToken);
    if (existingUser is not null)
    {
      throw new AuthConflictException("A user with this email already exists.");
    }

    var user = new AuthUser
    {
      Id = Guid.NewGuid(),
      Email = normalizedEmail,
      PasswordHash = passwordHashService.Hash(command.Password),
      Role = IdentityRoles.User,
      CreatedUtc = DateTime.UtcNow
    };

    await authUserRepository.AddAsync(user, cancellationToken);
    await authUserRepository.SaveChangesAsync(cancellationToken);

    return ToAuthenticatedUser(user);
  }

  public async Task<AuthTokenResult> LoginAsync(
    LoginUserCommand command,
    CancellationToken cancellationToken)
  {
    var normalizedEmail = NormalizeEmail(command.Email);
    var user = await authUserRepository.GetByEmailAsync(normalizedEmail, cancellationToken);

    if (user is null || !passwordHashService.Verify(command.Password, user.PasswordHash))
    {
      throw new AuthUnauthorizedException("Invalid email or password.");
    }

    return accessTokenService.GenerateToken(user);
  }

  public async Task<AuthenticatedUser?> GetCurrentUserAsync(Guid userId, CancellationToken cancellationToken)
  {
    var user = await authUserRepository.GetByIdAsync(userId, cancellationToken);
    return user is null ? null : ToAuthenticatedUser(user);
  }

  private static string NormalizeEmail(string email)
  {
    if (string.IsNullOrWhiteSpace(email))
    {
      throw new AuthValidationException(new Dictionary<string, string[]>
      {
        ["email"] = ["Email is required."]
      });
    }

    try
    {
      var parsed = new MailAddress(email.Trim());
      return parsed.Address.ToLowerInvariant();
    }
    catch (FormatException)
    {
      throw new AuthValidationException(new Dictionary<string, string[]>
      {
        ["email"] = ["Email format is invalid."]
      });
    }
  }

  private static void ValidatePassword(string password)
  {
    var errors = new Dictionary<string, string[]>();

    if (string.IsNullOrWhiteSpace(password))
    {
      errors["password"] = ["Password is required."];
    }
    else if (password.Trim().Length < 8)
    {
      errors["password"] = ["Password must have at least 8 characters."];
    }

    if (errors.Count > 0)
    {
      throw new AuthValidationException(errors);
    }
  }

  private static AuthenticatedUser ToAuthenticatedUser(AuthUser user) =>
    new(user.Id, user.Email, user.Role, user.CreatedUtc);
}
