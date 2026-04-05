namespace EcoPickup.Application.Authentication.Exceptions;

public sealed class AuthUnauthorizedException(string message) : Exception(message);
