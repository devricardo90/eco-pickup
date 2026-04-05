namespace EcoPickup.Application.Authentication.Models;

public sealed record AuthenticatedUser(
  Guid Id,
  string Email,
  string Role,
  DateTime CreatedUtc);
