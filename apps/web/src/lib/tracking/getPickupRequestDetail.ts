import {
  type HistoryScope,
  type PickupRequestDetail,
  type PickupRequestDetailResult
} from "@/lib/tracking/types";

const apiBaseUrl = process.env.ECOPICKUP_API_BASE_URL;

function getDetailPath(requestId: string, scope: HistoryScope) {
  return scope === "admin"
    ? `/api/v1/admin/pickup-requests/${requestId}`
    : `/api/v1/pickup-requests/${requestId}`;
}

export async function getPickupRequestDetail(
  requestId: string,
  scope: HistoryScope,
  accessToken: string
): Promise<PickupRequestDetailResult> {
  if (!apiBaseUrl) {
    return {
      ok: false,
      kind: "configuration",
      message: "Tracking is not configured yet. Set ECOPICKUP_API_BASE_URL to enable request detail reads."
    };
  }

  if (!accessToken) {
    return {
      ok: false,
      kind: "configuration",
      message: "Pickup request detail requires an authenticated web session."
    };
  }

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}${getDetailPath(requestId, scope)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      cache: "no-store"
    });
  } catch {
    return {
      ok: false,
      kind: "request",
      message: "Could not load pickup request details right now."
    };
  }

  if (response.status === 404) {
    return {
      ok: false,
      kind: "not-found",
      message: "No pickup request detail was found for this identifier.",
      statusCode: response.status
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      kind: "request",
      message: "Could not load pickup request details right now.",
      statusCode: response.status
    };
  }

  const data = (await response.json()) as PickupRequestDetail;
  return {
    ok: true,
    data
  };
}
