import { describe, expect, it } from "vitest";
import { buildCreatePickupRequestPayload } from "@/lib/tracking/createPickupRequestPayload";

describe("buildCreatePickupRequestPayload", () => {
  it("builds the API payload with normalized optional fields", () => {
    const payload = buildCreatePickupRequestPayload({
      description: "Two-seat sofa",
      pickupWindowDate: "2026-04-09",
      pickupWindowStartTime: "09:00",
      pickupWindowEndTime: "11:00",
      street: "Main Street 1",
      city: "Stockholm",
      postalCode: "11122",
      floor: "",
      hasElevator: true,
      accessNotes: "",
      itemCategory: "sofa",
      itemDescription: "Blue two-seat sofa",
      itemEstimatedSize: "large"
    });

    expect(payload.address.floor).toBeNull();
    expect(payload.address.accessNotes).toBeNull();
    expect(payload.items).toHaveLength(1);
    expect(payload.pickupWindowStartUtc).toBe("2026-04-09T09:00:00.000Z");
    expect(payload.pickupWindowEndUtc).toBe("2026-04-09T11:00:00.000Z");
  });
});
