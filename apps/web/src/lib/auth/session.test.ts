import { describe, expect, it } from "vitest";
import { isSessionExpired } from "@/lib/auth/session-utils";

describe("isSessionExpired", () => {
  it("returns false for a future expiration", () => {
    expect(isSessionExpired(new Date(Date.now() + 60_000).toISOString())).toBe(false);
  });

  it("returns true for a past expiration", () => {
    expect(isSessionExpired(new Date(Date.now() - 60_000).toISOString())).toBe(true);
  });

  it("returns true for an invalid date string", () => {
    expect(isSessionExpired("not-a-date")).toBe(true);
  });
});
