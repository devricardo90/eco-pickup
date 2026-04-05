namespace EcoPickup.Application.Authentication.Exceptions;

public sealed class AuthConflictException(string message) : Exception(message);
