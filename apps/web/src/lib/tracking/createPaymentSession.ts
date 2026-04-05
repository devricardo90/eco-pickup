type PaymentSessionResult = {
  id: string;
  pickupRequestId: string;
  provider: string;
  providerSessionId: string;
  checkoutUrl: string;
  amount: number;
  currency: string;
  status: string;
  providerPaymentId: string | null;
  failureReason: string | null;
  createdUtc: string;
  updatedUtc: string;
  confirmedUtc: string | null;
};

const apiBaseUrl = process.env.ECOPICKUP_API_BASE_URL;

export async function createPaymentSession(requestId: string, accessToken: string) {
  if (!apiBaseUrl) {
    return {
      ok: false as const,
      error: "Payment session creation is not configured yet. Set ECOPICKUP_API_BASE_URL to enable it."
    };
  }

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/api/v1/pickup-requests/${requestId}/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      cache: "no-store"
    });
  } catch {
    return {
      ok: false as const,
      error: "Could not start payment right now."
    };
  }

  if (!response.ok) {
    if (response.status === 400) {
      return {
        ok: false as const,
        error: "Payment is not available for this request right now."
      };
    }

    if (response.status === 401) {
      return {
        ok: false as const,
        error: "Your session is no longer valid. Sign in again and retry."
      };
    }

    if (response.status === 404) {
      return {
        ok: false as const,
        error: "Pickup request not found."
      };
    }

    return {
      ok: false as const,
      error: "Could not start payment right now."
    };
  }

  const data = (await response.json()) as PaymentSessionResult;
  return {
    ok: true as const,
    data
  };
}
