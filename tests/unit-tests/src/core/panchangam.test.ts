import { describe, it, expect } from "vitest";
import { computePanchangam } from "../../../../src/core/panchangam";

describe("computePanchangam", () => {
  it("returns sidereal sun longitude within ±0.02° and moon longitude within ±0.06° for reference case", () => {
    // Fri May 08 2026 18:34:10 GMT-0400 (Eastern Daylight Time)
    const date = new Date("2026-05-08T22:34:10Z");
    const latitude = 39.0437192;
    const longitude = -77.4874899;

    const result = computePanchangam(date, latitude, longitude);

    expect(Math.abs(result.sunSidereal - 24.1)).toBeLessThanOrEqual(0.02);
    expect(Math.abs(result.moonSidereal - 283.41)).toBeLessThanOrEqual(0.06);
  });
});
