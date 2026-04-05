using EcoPickup.Infrastructure.Authentication;
using Xunit;

namespace EcoPickup.UnitTests.Authentication;

public sealed class Pbkdf2PasswordHashServiceTests
{
  [Fact]
  public void Hash_ShouldGenerateVerifiablePasswordHash()
  {
    var service = new Pbkdf2PasswordHashService();
    var passwordHash = service.Hash("strongpass");

    Assert.NotEqual("strongpass", passwordHash);
    Assert.True(service.Verify("strongpass", passwordHash));
  }

  [Fact]
  public void Verify_ShouldReturnFalseForDifferentPassword()
  {
    var service = new Pbkdf2PasswordHashService();
    var passwordHash = service.Hash("strongpass");

    Assert.False(service.Verify("wrongpass", passwordHash));
  }
}
