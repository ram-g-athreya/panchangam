import { describe, it, expect } from "vitest";
import { computePanchangam } from "../../../../src/core/panchangam";

describe("computePanchangam", () => {
  it("returns correct panchangam for reference case: Fri May 08 2026 18:34:10 GMT-0400, Virginia", () => {
    const date = new Date("2026-05-08T22:34:10Z");
    const latitude = 39.0437192;
    const longitude = -77.4874899;

    const result = computePanchangam(date, latitude, longitude);

    expect(result.tithi.name).toBe("Saptami");
    expect(result.vara).toBe("Shukravara");
    expect(result.nakshatra).toBe("Shravana");
    expect(result.karana).toBe("Bava");
    expect(result.ayane).toBe("Uttarayana");
    expect(result.ritau).toBe("Vasanta");
    expect(Math.abs(result.sunSidereal - 24.1)).toBeLessThanOrEqual(0.02);
    expect(Math.abs(result.moonSidereal - 283.41)).toBeLessThanOrEqual(0.06);
  });
});
