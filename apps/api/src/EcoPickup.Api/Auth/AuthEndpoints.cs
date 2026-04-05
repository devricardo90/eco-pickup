using System.Security.Claims;
using EcoPickup.Application.Authentication.Abstractions;
using EcoPickup.Application.Authentication.Exceptions;
using EcoPickup.Application.Authentication.Models;
using EcoPickup.Domain.Identity;
using Microsoft.AspNetCore.Authorization;

namespace EcoPickup.Api.Auth;

public static class AuthEndpoints
{
  public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
  {
    var authGroup = app.MapGroup("/api/v1/auth")
      .WithTags("Auth");

    authGroup.MapPost("/register", RegisterAsync)
      .WithName("RegisterUser")
      .Produces<AuthenticatedUser>(StatusCodes.Status201Created)
      .ProducesValidationProblem()
      .Produces(StatusCodes.Status409Conflict);

    authGroup.MapPost("/login", LoginAsync)
      .WithName("LoginUser")
      .Produces<AuthTokenResult>(StatusCodes.Status200OK)
      .ProducesValidationProblem()
      .Produces(StatusCodes.Status401Unauthorized);

    authGroup.MapGet("/me", GetCurrentUserAsync)
      .WithName("GetCurrentUser")
      .RequireAuthorization()
      .Produces<AuthenticatedUser>(StatusCodes.Status200OK)
      .Produces(StatusCodes.Status401Unauthorized);

    authGroup.MapGet("/admin-check", [Authorize(Roles = IdentityRoles.Admin)] () => Results.Ok(new
    {
      role = IdentityRoles.Admin,
      status = "authorized"
    }))
      .WithName("AdminCheck")
      .Produces(StatusCodes.Status200OK)
      .Produces(StatusCodes.Status401Unauthorized)
      .Produces(StatusCodes.Status403Forbidden);

    return app;
  }

  private static async Task<IResult> RegisterAsync(
    RegisterRequest request,
    IAuthService authService,
    CancellationToken cancellationToken)
  {
    try
    {
      var user = await authService.RegisterAsync(
        new RegisterUserCommand(request.Email, request.Password),
        cancellationToken);

      return Results.Created($"/api/v1/auth/users/{user.Id}", user);
    }
    catch (AuthValidationException ex)
    {
      return Results.ValidationProblem(ex.Errors.ToDictionary(pair => pair.Key, pair => pair.Value));
    }
    catch (AuthConflictException ex)
    {
      return Results.Conflict(new { code = "AUTH_CONFLICT", message = ex.Message });
    }
  }

  private static async Task<IResult> LoginAsync(
    LoginRequest request,
    IAuthService authService,
    CancellationToken cancellationToken)
  {
    try
    {
      var token = await authService.LoginAsync(
        new LoginUserCommand(request.Email, request.Password),
        cancellationToken);

      return Results.Ok(token);
    }
    catch (AuthValidationException ex)
    {
      return Results.ValidationProblem(ex.Errors.ToDictionary(pair => pair.Key, pair => pair.Value));
    }
    catch (AuthUnauthorizedException ex)
    {
      return Results.Json(
        new { code = "AUTH_UNAUTHORIZED", message = ex.Message },
        statusCode: StatusCodes.Status401Unauthorized);
    }
  }

  private static async Task<IResult> GetCurrentUserAsync(
    ClaimsPrincipal principal,
    IAuthService authService,
    CancellationToken cancellationToken)
  {
    var subject = principal.FindFirstValue("sub");
    if (!Guid.TryParse(subject, out var userId))
    {
      return Results.Unauthorized();
    }

    var user = await authService.GetCurrentUserAsync(userId, cancellationToken);
    return user is null ? Results.NotFound() : Results.Ok(user);
  }

  public sealed record RegisterRequest(string Email, string Password);

  public sealed record LoginRequest(string Email, string Password);
}
