import { describe, expect, it } from "vitest";
import {
  formatTimelineDate,
  mapStatusLabel,
  mapTimelineEventToUi
} from "@/lib/tracking/mapTimelineEventToUi";

describe("mapTimelineEventToUi", () => {
  it("maps a system payment event to a human-readable timeline entry", () => {
    const result = mapTimelineEventToUi(
      {
        id: "evt_1",
        action: "payment",
        fromStatus: "awaiting_payment",
        toStatus: "paid",
        actorUserId: null,
        note: "Payment confirmed by secure webhook.",
        createdUtc: "2026-04-05T10:30:00Z"
      },
      "owner"
    );

    expect(result.title).toBe("Payment confirmed automatically");
    expect(result.actorLabel).toBe("System");
    expect(result.transitionLabel).toBe("Awaiting payment -> Paid");
    expect(result.isSystemEvent).toBe(true);
  });

  it("maps an admin action to the operator/admin actor label based on scope", () => {
    const ownerView = mapTimelineEventToUi(
      {
        id: "evt_2",
        action: "pricing",
        fromStatus: "under_review",
        toStatus: "awaiting_payment",
        actorUserId: "admin-1",
        note: null,
        createdUtc: "2026-04-05T12:00:00Z"
      },
      "owner"
    );

    const adminView = mapTimelineEventToUi(
      {
        id: "evt_2",
        action: "pricing",
        fromStatus: "under_review",
        toStatus: "awaiting_payment",
        actorUserId: "admin-1",
        note: null,
        createdUtc: "2026-04-05T12:00:00Z"
      },
      "admin"
    );

    expect(ownerView.title).toBe("Price defined");
    expect(ownerView.actorLabel).toBe("Admin");
    expect(adminView.actorLabel).toBe("Operator");
  });

  it("maps an owner submit event to the correct human label and actor", () => {
    const ownerView = mapTimelineEventToUi(
      {
        id: "evt_3",
        action: "submit",
        fromStatus: "draft",
        toStatus: "submitted",
        actorUserId: "user-1",
        note: null,
        createdUtc: "2026-04-05T13:30:00Z"
      },
      "owner"
    );

    const adminView = mapTimelineEventToUi(
      {
        id: "evt_3",
        action: "submit",
        fromStatus: "draft",
        toStatus: "submitted",
        actorUserId: "user-1",
        note: null,
        createdUtc: "2026-04-05T13:30:00Z"
      },
      "admin"
    );

    expect(ownerView.title).toBe("Request submitted");
    expect(ownerView.actorLabel).toBe("You");
    expect(adminView.actorLabel).toBe("User");
    expect(ownerView.transitionLabel).toBe("Draft -> Submitted");
  });

  it("keeps status and date formatting consistent", () => {
    expect(mapStatusLabel("under_review")).toBe("Under review");
    expect(formatTimelineDate("2026-04-05T08:05:00Z")).toContain("UTC");
  });
});
