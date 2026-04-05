import { describe, expect, it } from "vitest";
import { buildPickupRequestPayload } from "@/lib/tracking/createPickupRequestPayload";

describe("buildPickupRequestPayload", () => {
  it("builds the API payload with normalized optional fields", () => {
    const payload = buildPickupRequestPayload({
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
      items: [
        {
          category: "sofa",
          description: "Blue two-seat sofa",
          estimatedSize: "large"
        },
        {
          category: "lamp",
          description: "Floor lamp",
          estimatedSize: "small"
        }
      ]
    });

    expect(payload.address.floor).toBeNull();
    expect(payload.address.accessNotes).toBeNull();
    expect(payload.items).toHaveLength(2);
    expect(payload.items[1].category).toBe("lamp");
    expect(payload.pickupWindowStartUtc).toBe("2026-04-09T09:00:00.000Z");
    expect(payload.pickupWindowEndUtc).toBe("2026-04-09T11:00:00.000Z");
  });
});
