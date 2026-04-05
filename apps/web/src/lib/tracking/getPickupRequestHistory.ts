import {
  type HistoryScope,
  type PickupRequestHistory,
  type PickupRequestHistoryResult
} from "@/lib/tracking/types";

const ownerToken = process.env.ECOPICKUP_WEB_OWNER_ACCESS_TOKEN;
const adminToken = process.env.ECOPICKUP_WEB_ADMIN_ACCESS_TOKEN;
const apiBaseUrl = process.env.ECOPICKUP_API_BASE_URL;

function getHistoryPath(requestId: string, scope: HistoryScope) {
  return scope === "admin"
    ? `/api/v1/admin/pickup-requests/${requestId}/history`
    : `/api/v1/pickup-requests/${requestId}/history`;
}

function getAccessToken(scope: HistoryScope) {
  return scope === "admin" ? adminToken : ownerToken;
}

export async function getPickupRequestHistory(
  requestId: string,
  scope: HistoryScope
): Promise<PickupRequestHistoryResult> {
  if (!apiBaseUrl) {
    return {
      ok: false,
      kind: "configuration",
      message: "Tracking is not configured yet. Set ECOPICKUP_API_BASE_URL to enable history reads."
    };
  }

  const accessToken = getAccessToken(scope);
  if (!accessToken) {
    return {
      ok: false,
      kind: "configuration",
      message:
        scope === "admin"
          ? "Admin tracking is not configured yet. Set ECOPICKUP_WEB_ADMIN_ACCESS_TOKEN to enable this view."
          : "Owner tracking is not configured yet. Set ECOPICKUP_WEB_OWNER_ACCESS_TOKEN to enable this view."
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
