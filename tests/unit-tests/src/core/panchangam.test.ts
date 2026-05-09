import { describe, it, expect } from "vitest";
import { computePanchangam } from "../../../../src/core/panchangam";

const SUN_LONGITUDE_TOLERANCE = 0.02;
const MOON_LONGITUDE_TOLERANCE = 0.06;
const SOLAR_EVENT_TOLERANCE_MS = 60_000;

describe("computePanchangam", () => {
  it("returns correct panchangam for reference case: Fri May 08 2026 18:34:10 GMT-0400, Virginia", () => {
    const date = new Date("2026-05-08T22:34:10Z");
    const latitude = 39.0437192;
    const longitude = -77.4874899;

    const result = computePanchangam(date, latitude, longitude);

    expect(result.tithi.name).toBe("Saptami");
    expect(result.vara).toBe("Shukravara");
    expect(result.nakshatra).toBe("Shravana");
    expect(result.yoga).toBe("Shubha");
    expect(result.karana).toBe("Bava");
    expect(result.samvatsare).toBe("Parabhava");
    expect(result.ayane).toBe("Uttarayana");
    expect(result.ritau).toBe("Vasanta");
    expect(Math.abs(result.sunSidereal - 24.1)).toBeLessThanOrEqual(SUN_LONGITUDE_TOLERANCE);
    expect(Math.abs(result.moonSidereal - 283.41)).toBeLessThanOrEqual(MOON_LONGITUDE_TOLERANCE);

    // sunRise: Fri May 08 2026 06:04:00 GMT-0400 = 2026-05-08T10:04:00Z
    expect(result.sunRise).toBeDefined();
    expect(
      Math.abs(result.sunRise!.getTime() - new Date("2026-05-08T10:04:00Z").getTime()),
    ).toBeLessThanOrEqual(SOLAR_EVENT_TOLERANCE_MS);
    // sunSet: Thu May 07 2026 20:10:00 GMT-0400 = 2026-05-08T00:10:00Z
    expect(result.sunSet).toBeDefined();
    expect(
      Math.abs(result.sunSet!.getTime() - new Date("2026-05-08T00:10:00Z").getTime()),
    ).toBeLessThanOrEqual(SOLAR_EVENT_TOLERANCE_MS);
  });
});
