import {
  type HistoryScope,
  type PickupRequestHistory,
  type PickupRequestHistoryResult
} from "@/lib/tracking/types";

const apiBaseUrl = process.env.ECOPICKUP_API_BASE_URL;

function getHistoryPath(requestId: string, scope: HistoryScope) {
  return scope === "admin"
    ? `/api/v1/admin/pickup-requests/${requestId}/history`
    : `/api/v1/pickup-requests/${requestId}/history`;
}

export async function getPickupRequestHistory(
  requestId: string,
  scope: HistoryScope,
  accessToken: string
): Promise<PickupRequestHistoryResult> {
  if (!apiBaseUrl) {
    return {
      ok: false,
      kind: "configuration",
      message: "Tracking is not configured yet. Set ECOPICKUP_API_BASE_URL to enable history reads."
    };
  }

  if (!accessToken) {
    return {
      ok: false,
      kind: "configuration",
      message: "Tracking requires an authenticated web session."
    };
  }

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}${getHistoryPath(requestId, scope)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      cache: "no-store"
    });
  } catch {
    return {
      ok: false,
      kind: "request",
      message: "Could not load tracking history right now."
    };
  }

  if (response.status === 404) {
    return {
      ok: false,
      kind: "not-found",
      message: "No tracking history was found for this pickup request.",
      statusCode: response.status
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      kind: "request",
      message: "Could not load tracking history right now.",
      statusCode: response.status
    };
  }

  const data = (await response.json()) as PickupRequestHistory;
  return {
    ok: true,
    data
  };
}
