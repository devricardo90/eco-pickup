using EcoPickup.Api.Auth;
using EcoPickup.Api.Payments;
using EcoPickup.Api.PickupRequests;
using EcoPickup.Infrastructure.Authentication;
using Scalar.AspNetCore;
using EcoPickup.Infrastructure.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
  options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
  {
    Name = "Authorization",
    Type = SecuritySchemeType.Http,
    Scheme = "bearer",
    BearerFormat = "JWT",
    In = ParameterLocation.Header,
    Description = "Paste the JWT access token here."
  });

  options.AddSecurityRequirement(new OpenApiSecurityRequirement
  {
    {
      new OpenApiSecurityScheme
      {
        Reference = new OpenApiReference
        {
          Type = ReferenceType.SecurityScheme,
          Id = "Bearer"
        }
      },
      Array.Empty<string>()
    }
  });
});
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options =>
  {
    var jwtOptions = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>()
      ?? throw new InvalidOperationException("Jwt configuration is required.");

    options.MapInboundClaims = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
      ValidateIssuer = true,
      ValidateAudience = true,
      ValidateLifetime = true,
      ValidateIssuerSigningKey = true,
      ValidIssuer = jwtOptions.Issuer,
      ValidAudience = jwtOptions.Audience,
      IssuerSigningKey = jwtOptions.CreateSecurityKey(),
      RoleClaimType = "role",
      NameClaimType = JwtRegisteredClaimNames.Sub,
      ClockSkew = TimeSpan.Zero
    };
  });
builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.MapSwagger("/openapi/{documentName}.json");
  app.UseSwaggerUI();
  app.MapScalarApiReference("/scalar", options =>
  {
    options.WithTitle("EcoPickup API");
  });
}

app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks("/health");
app.MapGet("/", () => Results.Ok(new
{
  service = "EcoPickup.Api",
  status = "bootstrap"
}));
app.MapAuthEndpoints();
app.MapPickupRequestEndpoints();
app.MapPickupItemPhotoEndpoints();
app.MapAdminPickupRequestEndpoints();
app.MapPaymentEndpoints();

app.Run();
