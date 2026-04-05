using EcoPickup.Application.Payments;
using EcoPickup.Application.Payments.Abstractions;
using EcoPickup.Application.Payments.Models;
using EcoPickup.Application.PickupRequests.Exceptions;
using EcoPickup.Domain.PickupRequests;
using Xunit;

namespace EcoPickup.UnitTests.Payments;

public sealed class PaymentServiceTests
{
  [Fact]
  public async Task CreateSessionAsync_ShouldCreatePendingPaymentForOwnedAwaitingPaymentRequest()
  {
    var repository = new InMemoryPaymentRepository();
    var pickupRequest = CreatePickupRequest(Guid.NewGuid(), PickupRequestStatuses.AwaitingPayment);
    repository.StoredRequests.Add(pickupRequest);
    var service = new PaymentService(repository, new FakePaymentGateway());

    var result = await service.CreateSessionAsync(pickupRequest.Id, pickupRequest.UserId, CancellationToken.None);

    Assert.Equal(PaymentStatuses.Pending, result.Status);
    Assert.Equal(pickupRequest.Id, result.PickupRequestId);
    Assert.Single(repository.StoredPayments);
    Assert.Equal(pickupRequest.PriceTotal, repository.StoredPayments[0].Amount);
  }

  [Fact]
  public async Task CreateSessionAsync_ShouldThrowWhenRequestIsNotAwaitingPayment()
  {
    var repository = new InMemoryPaymentRepository();
    var pickupRequest = CreatePickupRequest(Guid.NewGuid(), PickupRequestStatuses.Quoted);
    repository.StoredRequests.Add(pickupRequest);
    var service = new PaymentService(repository, new FakePaymentGateway());

    await Assert.ThrowsAsync<PickupRequestValidationException>(() =>
      service.CreateSessionAsync(pickupRequest.Id, pickupRequest.UserId, CancellationToken.None));
  }

  [Fact]
  public async Task ConfirmAsync_ShouldMarkPaymentPaidAndMoveRequestToPaid()
  {
    var repository = new InMemoryPaymentRepository();
    var pickupRequest = CreatePickupRequest(Guid.NewGuid(), PickupRequestStatuses.AwaitingPayment);
    var payment = CreatePayment(pickupRequest, PaymentStatuses.Pending);
    repository.StoredRequests.Add(pickupRequest);
    repository.StoredPayments.Add(payment);
    pickupRequest.Payments.Add(payment);
    var service = new PaymentService(repository, new FakePaymentGateway());

    var result = await service.ConfirmAsync(
      new ConfirmPaymentCommand(payment.ProviderSessionId, PaymentStatuses.Paid, "pay_123", null),
      CancellationToken.None);

    Assert.NotNull(result);
    Assert.Equal(PaymentStatuses.Paid, result!.Status);
    Assert.Equal(PickupRequestStatuses.Paid, pickupRequest.Status);
    Assert.Single(pickupRequest.StatusHistory);
    Assert.Equal("payment", pickupRequest.StatusHistory[0].Action);
  }

  [Fact]
  public async Task ConfirmAsync_ShouldMarkPaymentFailedWithoutChangingRequestStatus()
  {
    var repository = new InMemoryPaymentRepository();
    var pickupRequest = CreatePickupRequest(Guid.NewGuid(), PickupRequestStatuses.AwaitingPayment);
    var payment = CreatePayment(pickupRequest, PaymentStatuses.Pending);
    repository.StoredRequests.Add(pickupRequest);
    repository.StoredPayments.Add(payment);
    pickupRequest.Payments.Add(payment);
    var service = new PaymentService(repository, new FakePaymentGateway());

    var result = await service.ConfirmAsync(
      new ConfirmPaymentCommand(payment.ProviderSessionId, PaymentStatuses.Failed, null, "Card declined"),
      CancellationToken.None);

    Assert.NotNull(result);
    Assert.Equal(PaymentStatuses.Failed, result!.Status);
    Assert.Equal(PickupRequestStatuses.AwaitingPayment, pickupRequest.Status);
    Assert.Empty(pickupRequest.StatusHistory);
    Assert.Equal("Card declined", payment.FailureReason);
  }

  private sealed class InMemoryPaymentRepository : IPaymentRepository
  {
    public List<PickupRequest> StoredRequests { get; } = [];

    public List<Payment> StoredPayments { get; } = [];

    public Task<PickupRequest?> GetOwnedRequestForPaymentAsync(Guid pickupRequestId, Guid userId, CancellationToken cancellationToken) =>
      Task.FromResult(StoredRequests.SingleOrDefault(x => x.Id == pickupRequestId && x.UserId == userId));

    public Task<Payment?> GetByProviderSessionIdAsync(string providerSessionId, CancellationToken cancellationToken) =>
      Task.FromResult(StoredPayments.SingleOrDefault(x => x.ProviderSessionId == providerSessionId));

    public Task AddAsync(Payment payment, CancellationToken cancellationToken)
    {
      StoredPayments.Add(payment);
      var pickupRequest = StoredRequests.Single(x => x.Id == payment.PickupRequestId);
      pickupRequest.Payments.Add(payment);
      return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
      Task.CompletedTask;
  }

  private sealed class FakePaymentGateway : IPaymentGateway
  {
    public Task<PaymentSessionResult> CreateSessionAsync(CreatePaymentSessionCommand command, CancellationToken cancellationToken) =>
      Task.FromResult(new PaymentSessionResult("FakeCheckout", "session_123", "https://payments.ecopickup.local/checkout/session_123"));
  }

  private static PickupRequest CreatePickupRequest(Guid userId, string status) =>
    new()
    {
      Id = Guid.NewGuid(),
      UserId = userId,
      Description = "Payment test request",
      Status = status,
      PriceBase = 199m,
      PriceSizeAdjustment = 99m,
      PriceFloorAdjustment = 79m,
      PriceDistanceAdjustment = 50m,
      PriceTotal = 427m,
      PriceCurrency = "SEK",
      PickupWindowStartUtc = DateTime.UtcNow.AddDays(1),
      PickupWindowEndUtc = DateTime.UtcNow.AddDays(1).AddHours(2),
      CreatedUtc = DateTime.UtcNow,
      Address = new Address
      {
        Id = Guid.NewGuid(),
        Street = "Main Street 1",
        City = "Stockholm",
        PostalCode = "11122",
        HasElevator = true
      }
    };

  private static Payment CreatePayment(PickupRequest pickupRequest, string status) =>
    new()
    {
      Id = Guid.NewGuid(),
      PickupRequestId = pickupRequest.Id,
      PickupRequest = pickupRequest,
      Provider = "FakeCheckout",
      ProviderSessionId = "session_123",
      CheckoutUrl = "https://payments.ecopickup.local/checkout/session_123",
      Amount = 427m,
      Currency = "SEK",
      Status = status,
      CreatedUtc = DateTime.UtcNow,
      UpdatedUtc = DateTime.UtcNow
    };
}
