using EcoPickup.Infrastructure.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Xunit;

namespace EcoPickup.UnitTests.Infrastructure;

public sealed class InfrastructureServiceCollectionExtensionsTests
{
  [Fact]
  public void AddInfrastructure_Throws_WhenConnectionStringIsMissing()
  {
    var configuration = new ConfigurationBuilder().Build();
    var services = new ServiceCollection();
    var environment = new TestHostEnvironment("Staging");

    var exception = Assert.Throws<InvalidOperationException>(() =>
      services.AddInfrastructure(configuration, environment));

    Assert.Contains("ConnectionStrings__Database", exception.Message);
  }

  [Fact]
  public void AddInfrastructure_Throws_WhenNonDevelopmentUsesLocalhostDatabase()
  {
    var configuration = new ConfigurationBuilder()
      .AddInMemoryCollection(new Dictionary<string, string?>
      {
        ["ConnectionStrings:Database"] = "Host=localhost;Port=5432;Database=ecopickup;Username=postgres;Password=postgres"
      })
      .Build();
    var services = new ServiceCollection();
    var environment = new TestHostEnvironment("Staging");

    var exception = Assert.Throws<InvalidOperationException>(() =>
      services.AddInfrastructure(configuration, environment));

    Assert.Contains("cannot use a localhost host outside Development", exception.Message);
  }

  [Fact]
  public void AddInfrastructure_AllowsLocalhostDatabaseInDevelopment()
  {
    var configuration = new ConfigurationBuilder()
      .AddInMemoryCollection(new Dictionary<string, string?>
      {
        ["ConnectionStrings:Database"] = "Host=localhost;Port=5432;Database=ecopickup_dev;Username=postgres;Password=postgres"
      })
      .Build();
    var services = new ServiceCollection();
    var environment = new TestHostEnvironment(Environments.Development);

    services.AddInfrastructure(configuration, environment);
  }

  private sealed class TestHostEnvironment(string environmentName) : IHostEnvironment
  {
    public string EnvironmentName { get; set; } = environmentName;
    public string ApplicationName { get; set; } = "EcoPickup.UnitTests";
    public string ContentRootPath { get; set; } = Directory.GetCurrentDirectory();
    public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
  }
}
