import type { PickupRequestDetail } from "@/lib/tracking/types";

type CreatePickupRequestPayload = {
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

export async function createPickupRequest(
  accessToken: string,
  payload: CreatePickupRequestPayload
) {
  if (!apiBaseUrl) {
    return {
      ok: false as const,
      error: "Pickup request creation is not configured yet. Set ECOPICKUP_API_BASE_URL to enable it."
    };
  }

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/api/v1/pickup-requests`, {
      method: "POST",
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
      error: "Could not create the pickup request right now."
    };
  }

  if (!response.ok) {
    if (response.status === 400) {
      return {
        ok: false as const,
        error: "Check the required fields and pickup window before submitting."
      };
    }

    if (response.status === 401) {
      return {
        ok: false as const,
        error: "Your session is no longer valid. Sign in again and retry."
      };
    }

    return {
      ok: false as const,
      error: "Could not create the pickup request right now."
    };
  }

  const data = (await response.json()) as PickupRequestDetail;
  return {
    ok: true as const,
    data
  };
}
