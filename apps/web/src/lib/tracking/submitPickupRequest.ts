import type { PickupRequestDetail } from "@/lib/tracking/types";

const apiBaseUrl = process.env.ECOPICKUP_API_BASE_URL;

export async function submitPickupRequest(requestId: string, accessToken: string, note?: string) {
  if (!apiBaseUrl) {
    return {
      ok: false as const,
      error: "Pickup request submission is not configured yet. Set ECOPICKUP_API_BASE_URL to enable it."
    };
  }

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/api/v1/pickup-requests/${requestId}/submit`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        note: note?.trim() || null
      }),
      cache: "no-store"
    });
  } catch {
    return {
      ok: false as const,
      error: "Could not submit the pickup request right now."
    };
  }

  if (!response.ok) {
    if (response.status === 400) {
      return {
        ok: false as const,
        error: "This request can no longer be submitted."
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
      error: "Could not submit the pickup request right now."
    };
  }

  const data = (await response.json()) as PickupRequestDetail;
  return {
    ok: true as const,
    data
  };
}
