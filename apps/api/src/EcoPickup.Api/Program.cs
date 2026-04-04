using Scalar.AspNetCore;
using EcoPickup.Infrastructure.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks();
builder.Services.AddInfrastructure(builder.Configuration);

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

app.MapHealthChecks("/health");
app.MapGet("/", () => Results.Ok(new
{
  service = "EcoPickup.Api",
  status = "bootstrap"
}));

app.Run();
