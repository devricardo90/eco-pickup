namespace EcoPickup.Application.Authentication.Exceptions;

public sealed class AuthValidationException(IReadOnlyDictionary<string, string[]> errors)
  : Exception("One or more validation errors occurred.")
{
  public IReadOnlyDictionary<string, string[]> Errors { get; } = errors;
}
