import { describe, expect, it } from "vitest";
import {
  mapPickupRequestListCardToUi,
  mapPickupRequestMetadataToUi,
  mapPickupRequestPaymentToUi,
  mapPickupRequestPricingToUi,
  mapPickupRequestSchedulingToUi,
  mapPickupRequestSummaryToUi
} from "@/lib/tracking/mapPickupRequestDetailToUi";
import type { PickupRequestDetail } from "@/lib/tracking/types";

const detail: PickupRequestDetail = {
  id: "req_1",
  userId: "user_1",
  description: "Two-seat sofa and side table",
  status: "scheduled",
  pricing: {
    basePrice: 199,
    sizeAdjustment: 99,
    floorAdjustment: 20,
    distanceAdjustment: 10,
    total: 328,
    currency: "SEK"
  },
  scheduling: {
    confirmedPickupWindowStartUtc: "2026-04-08T09:00:00Z",
    confirmedPickupWindowEndUtc: "2026-04-08T11:00:00Z"
  },
  pickupWindowStartUtc: "2026-04-07T09:00:00Z",
  pickupWindowEndUtc: "2026-04-07T12:00:00Z",
  createdUtc: "2026-04-05T08:00:00Z",
  address: {
    id: "addr_1",
    street: "Main Street 1",
    city: "Stockholm",
    postalCode: "11122",
    floor: "3",
    hasElevator: false,
    accessNotes: "Ring bell 21"
  },
  items: [
    {
      id: "item_1",
      category: "sofa",
      description: "Two-seat sofa",
      estimatedSize: "large",
      createdUtc: "2026-04-05T08:01:00Z",
      photos: [
        {
          id: "photo_1",
          storageKey: "s3/key",
          originalFileName: "sofa.jpg",
          contentType: "image/jpeg",
          sizeBytes: 1024,
          createdUtc: "2026-04-05T08:02:00Z"
        }
      ]
    },
    {
      id: "item_2",
      category: "table",
      description: "Side table",
      estimatedSize: "small",
      createdUtc: "2026-04-05T08:03:00Z",
      photos: []
    }
  ]
};

describe("mapPickupRequestDetailToUi", () => {
  it("builds a summary with readable status and item count", () => {
    const summary = mapPickupRequestSummaryToUi(detail, "08 Apr 2026, 11:00 UTC");

    expect(summary.currentStatus).toBe("Scheduled");
    expect(summary.itemSummary).toContain("2 items");
    expect(summary.itemSummary).toContain("sofa");
  });

  it("builds metadata entries for address, scheduling and pricing", () => {
    const metadata = mapPickupRequestMetadataToUi(detail);
    const labels = metadata.map((entry) => entry.label);

    expect(labels).toContain("Requested pickup window");
    expect(labels).toContain("Address");
    expect(labels).toContain("Confirmed schedule");
    expect(labels).toContain("Quoted total");
    expect(metadata.find((entry) => entry.label === "Photos attached")?.value).toBe("1 photo");
  });

  it("builds a list card with the correct route and summaries", () => {
    const ownerCard = mapPickupRequestListCardToUi(detail, "owner");
    const adminCard = mapPickupRequestListCardToUi(detail, "admin");

    expect(ownerCard.href).toBe("/tracking/req_1");
    expect(adminCard.href).toBe("/admin/tracking/req_1");
    expect(ownerCard.statusLabel).toBe("Scheduled");
    expect(ownerCard.itemSummary).toContain("2 items");
    expect(ownerCard.priceSummary).toContain("SEK");
  });

  it("builds a pricing card for awaiting payment visibility", () => {
    const pricing = mapPickupRequestPricingToUi({
      ...detail,
      status: "awaiting_payment"
    });

    expect(pricing).not.toBeNull();
    expect(pricing?.title).toBe("Awaiting payment");
    expect(pricing?.totalLabel).toContain("SEK");
    expect(pricing?.breakdown).toHaveLength(4);
  });

  it("builds a pending quote state while pricing is still under review", () => {
    const pricing = mapPickupRequestPricingToUi({
      ...detail,
      status: "under_review",
      pricing: null
    });

    expect(pricing).not.toBeNull();
    expect(pricing?.title).toBe("Quote in review");
    expect(pricing?.totalLabel).toBeNull();
    expect(pricing?.breakdown).toHaveLength(0);
  });

  it("builds a payment card for awaiting payment", () => {
    const payment = mapPickupRequestPaymentToUi({
      ...detail,
      status: "awaiting_payment"
    });

    expect(payment).not.toBeNull();
    expect(payment?.title).toBe("Payment ready");
    expect(payment?.actionLabel).toBe("Continue to checkout");
    expect(payment?.amountLabel).toContain("SEK");
  });

  it("builds a paid state without payment action", () => {
    const payment = mapPickupRequestPaymentToUi({
      ...detail,
      status: "paid"
    });

    expect(payment).not.toBeNull();
    expect(payment?.title).toBe("Payment confirmed");
    expect(payment?.actionLabel).toBeNull();
    expect(payment?.amountLabel).toContain("SEK");
  });

  it("builds a post-payment scheduling pending state", () => {
    const scheduling = mapPickupRequestSchedulingToUi({
      ...detail,
      status: "paid",
      scheduling: null
    });

    expect(scheduling).not.toBeNull();
    expect(scheduling?.title).toBe("Payment complete");
    expect(scheduling?.confirmedWindowLabel).toBeNull();
  });

  it("builds a scheduled state with confirmed window", () => {
    const scheduling = mapPickupRequestSchedulingToUi({
      ...detail,
      status: "scheduled"
    });

    expect(scheduling).not.toBeNull();
    expect(scheduling?.title).toBe("Pickup scheduled");
    expect(scheduling?.confirmedWindowLabel).toContain("UTC");
  });
});
