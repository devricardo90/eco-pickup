namespace EcoPickup.Application.Authentication.Models;

public sealed record RegisterUserCommand(
  string Email,
  string Password);
