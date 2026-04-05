import {
  type HistoryScope,
  type PickupRequestHistoryEvent,
  type TimelineUiEvent
} from "@/lib/tracking/types";

const statusLabels = new Map<string, string>([
  ["draft", "Draft"],
  ["submitted", "Submitted"],
  ["under_review", "Under review"],
  ["quoted", "Quoted"],
  ["awaiting_payment", "Awaiting payment"],
  ["paid", "Paid"],
  ["scheduled", "Scheduled"],
  ["in_transit", "In transit"],
  ["collected", "Collected"],
  ["completed", "Completed"],
  ["cancelled", "Cancelled"],
  ["rejected", "Rejected"]
]);

const actionLabels = new Map<string, string>([
  ["approve", "Request approved"],
  ["reject", "Request rejected"],
  ["pricing", "Price defined"],
  ["scheduling", "Pickup scheduled"],
  ["payment", "Payment confirmed"]
]);

function humanizeToken(value: string) {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function mapStatusLabel(status: string) {
  return statusLabels.get(status) ?? humanizeToken(status);
}

export function formatTimelineDate(createdUtc: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC"
  }).format(new Date(createdUtc)) + " UTC";
}

function mapActionTitle(action: string, toStatus: string) {
  if (action === "payment" && toStatus === "paid") {
    return "Payment confirmed automatically";
  }

  return actionLabels.get(action) ?? humanizeToken(action);
}

function mapActorLabel(scope: HistoryScope, actorUserId: string | null) {
  if (!actorUserId) {
    return "System";
  }

  return scope === "admin" ? "Operator" : "Admin";
}

export function mapTimelineEventToUi(
  event: PickupRequestHistoryEvent,
  scope: HistoryScope
): TimelineUiEvent {
  return {
    id: event.id,
    title: mapActionTitle(event.action, event.toStatus),
    transitionLabel: `${mapStatusLabel(event.fromStatus)} -> ${mapStatusLabel(event.toStatus)}`,
    actorLabel: mapActorLabel(scope, event.actorUserId),
    note: event.note,
    createdLabel: formatTimelineDate(event.createdUtc),
    isSystemEvent: event.actorUserId === null
  };
}
