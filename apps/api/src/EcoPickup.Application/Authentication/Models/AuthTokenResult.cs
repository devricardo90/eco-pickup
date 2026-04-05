namespace EcoPickup.Application.Authentication.Models;

public sealed record AuthTokenResult(
  string AccessToken,
  string TokenType,
  DateTime ExpiresAtUtc,
  AuthenticatedUser User);
