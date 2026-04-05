namespace EcoPickup.Application.PickupRequests.Exceptions;

public sealed class PickupRequestValidationException(IReadOnlyDictionary<string, string[]> errors)
  : Exception("One or more validation errors occurred.")
{
  public IReadOnlyDictionary<string, string[]> Errors { get; } = errors;
}
