import { describe, it, expect } from "vitest";
import { computePanchangam } from "../../../../src/core/panchangam";

const SOLAR_EVENT_TOLERANCE_MS = 60_000;
const END_TIME_TOLERANCE_MS = 60_000;

describe("computePanchangam", () => {
  it("returns correct panchangam for reference case: Fri May 08 2026 18:34:10 GMT-0400, Virginia", () => {
    const date = new Date("2026-05-08T22:34:10Z");
    const latitude = 39.0437192;
    const longitude = -77.4874899;

    const result = computePanchangam(date, latitude, longitude);

    expect(result.tithi.name).toBe("Saptamī");
    expect(result.vara).toBe("Śukravāra");
    expect(result.nakshatras[0].name).toBe("Uttarāṣāḍhā");
    expect(result.nakshatras[0].endTime).toBeDefined();
    expect(
      Math.abs(
        result.nakshatras[0].endTime!.getTime() - new Date("2026-05-08T15:50:00Z").getTime(),
      ),
    ).toBeLessThanOrEqual(END_TIME_TOLERANCE_MS);
    expect(result.nakshatras[1].name).toBe("Śravaṇa");
    expect(result.yogas[0].name).toBe("Śubha");
    expect(result.yogas[0].endTime).toBeDefined();
    expect(
      Math.abs(result.yogas[0].endTime!.getTime() - new Date("2026-05-08T21:00:00Z").getTime()),
    ).toBeLessThanOrEqual(END_TIME_TOLERANCE_MS);
    expect(result.yogas[1].name).toBe("Śukla");
    expect(result.karanas[0].name).toBe("Viṣṭi");
    expect(result.karanas[0].endTime).toBeDefined();
    expect(
      Math.abs(result.karanas[0].endTime!.getTime() - new Date("2026-05-08T19:46:00Z").getTime()),
    ).toBeLessThanOrEqual(END_TIME_TOLERANCE_MS);
    expect(result.karanas[1].name).toBe("Bava");
    expect(result.samvatsare).toBe("Parābhava");
    expect(result.ayane).toBe("Uttarayana");
    expect(result.ritau).toBe("Vasanta");
    expect(result.mase).toBe("Vaiśākha");

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
