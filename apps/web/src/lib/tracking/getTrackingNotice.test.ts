import { describe, expect, it } from "vitest";
import { getTrackingNotice } from "@/lib/tracking/getTrackingNotice";

describe("getTrackingNotice", () => {
  it("returns a saved draft notice", () => {
    expect(getTrackingNotice({ saved: "1" })).toBe("Pickup request saved as draft.");
  });

  it("returns a submitted notice", () => {
    expect(getTrackingNotice({ submitted: "1" })).toBe("Pickup request submitted successfully.");
  });

  it("prioritizes submit failure when a draft was already persisted", () => {
    expect(getTrackingNotice({ saved: "1", submitFailed: "1" })).toBe(
      "Draft saved, but submission did not complete. Retry from this detail page when you are ready."
    );
  });
});
