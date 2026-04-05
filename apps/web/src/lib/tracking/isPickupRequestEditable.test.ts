import { describe, expect, it } from "vitest";
import { isPickupRequestEditable } from "@/lib/tracking/isPickupRequestEditable";

describe("isPickupRequestEditable", () => {
  it("allows editing while the request is still draft", () => {
    expect(isPickupRequestEditable("draft")).toBe(true);
  });

  it("blocks editing once the request has entered operational flow", () => {
    expect(isPickupRequestEditable("under_review")).toBe(false);
    expect(isPickupRequestEditable("awaiting_payment")).toBe(false);
    expect(isPickupRequestEditable("scheduled")).toBe(false);
  });
});
