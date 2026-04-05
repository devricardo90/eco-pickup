import type { PickupRequestDetail } from "@/lib/tracking/types";

type UpdatePickupRequestPayload = {
  description: string;
  pickupWindowStartUtc: string;
  pickupWindowEndUtc: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    floor: string | null;
    hasElevator: boolean;
    accessNotes: string | null;
  };
  items: Array<{
    category: string;
    description: string;
    estimatedSize: string;
  }>;
};

const apiBaseUrl = process.env.ECOPICKUP_API_BASE_URL;

export async function updatePickupRequest(
  requestId: string,
  accessToken: string,
  payload: UpdatePickupRequestPayload
) {
  if (!apiBaseUrl) {
    return {
      ok: false as const,
      error: "Pickup request editing is not configured yet. Set ECOPICKUP_API_BASE_URL to enable it."
    };
  }

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/api/v1/pickup-requests/${requestId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      cache: "no-store"
    });
  } catch {
    return {
      ok: false as const,
      error: "Could not update the pickup request right now."
    };
  }

  if (!response.ok) {
    if (response.status === 400) {
      return {
        ok: false as const,
        error: "This request can no longer be edited or the submitted fields are invalid."
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
      error: "Could not update the pickup request right now."
    };
  }

  const data = (await response.json()) as PickupRequestDetail;
  return {
    ok: true as const,
    data
  };
}
