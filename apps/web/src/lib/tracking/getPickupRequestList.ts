import {
  type HistoryScope,
  type PickupRequestListItem,
  type PickupRequestListResult
} from "@/lib/tracking/types";

const apiBaseUrl = process.env.ECOPICKUP_API_BASE_URL;

function getListPath(scope: HistoryScope) {
  return scope === "admin" ? "/api/v1/admin/pickup-requests" : "/api/v1/pickup-requests";
}

export async function getPickupRequestList(
  scope: HistoryScope,
  accessToken: string
): Promise<PickupRequestListResult> {
  if (!apiBaseUrl) {
    return {
      ok: false,
      kind: "configuration",
      message: "Tracking is not configured yet. Set ECOPICKUP_API_BASE_URL to enable pickup request list reads."
    };
  }

  if (!accessToken) {
    return {
      ok: false,
      kind: "configuration",
      message: "Pickup request list requires an authenticated web session."
    };
  }

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}${getListPath(scope)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      cache: "no-store"
    });
  } catch {
    return {
      ok: false,
      kind: "request",
      message: "Could not load pickup requests right now."
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      kind: "request",
      message: "Could not load pickup requests right now.",
      statusCode: response.status
    };
  }

  const data = (await response.json()) as PickupRequestListItem[];
  return {
    ok: true,
    data
  };
}
