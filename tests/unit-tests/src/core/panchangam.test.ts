import { describe, it, expect } from "vitest";
import { computePanchangam, type Panchangam } from "../../../../src/core/panchangam";

const SOLAR_EVENT_TOLERANCE_MS = 60_000;
const END_TIME_TOLERANCE_MS = 60_000;

function assertCommon(result: Panchangam, expected: Panchangam) {
  expect(result.tithi.name).toBe(expected.tithi.name);
  expect(result.tithi.number).toBe(expected.tithi.number);
  expect(result.tithi.paksha).toBe(expected.tithi.paksha);
  expect(result.vara).toBe(expected.vara);

  expect(result.nakshatras[0].name).toBe(expected.nakshatras[0].name);
  expect(result.nakshatras[0].endTime).toBeDefined();
  expect(
    Math.abs(result.nakshatras[0].endTime!.getTime() - expected.nakshatras[0].endTime!.getTime()),
  ).toBeLessThanOrEqual(END_TIME_TOLERANCE_MS);
  expect(result.nakshatras[1].name).toBe(expected.nakshatras[1].name);

  expect(result.yogas[0].name).toBe(expected.yogas[0].name);
  expect(result.yogas[0].endTime).toBeDefined();
  expect(
    Math.abs(result.yogas[0].endTime!.getTime() - expected.yogas[0].endTime!.getTime()),
  ).toBeLessThanOrEqual(END_TIME_TOLERANCE_MS);
  expect(result.yogas[1].name).toBe(expected.yogas[1].name);

  expect(result.karanas[0].name).toBe(expected.karanas[0].name);
  expect(result.karanas[0].endTime).toBeDefined();
  expect(
    Math.abs(result.karanas[0].endTime!.getTime() - expected.karanas[0].endTime!.getTime()),
  ).toBeLessThanOrEqual(END_TIME_TOLERANCE_MS);
  expect(result.karanas[1].name).toBe(expected.karanas[1].name);

  expect(result.samvatsare).toBe(expected.samvatsare);
  expect(result.ayana).toBe(expected.ayana);
  expect(result.ritu).toBe(expected.ritu);
  expect(result.masa).toBe(expected.masa);
  expect(result.sunRashi).toBe(expected.sunRashi);
  expect(result.moonRashi).toBe(expected.moonRashi);

  expect(result.sunRise).toBeDefined();
  expect(Math.abs(result.sunRise!.getTime() - expected.sunRise!.getTime())).toBeLessThanOrEqual(
    SOLAR_EVENT_TOLERANCE_MS,
  );
  expect(result.sunSet).toBeDefined();
  expect(Math.abs(result.sunSet!.getTime() - expected.sunSet!.getTime())).toBeLessThanOrEqual(
    SOLAR_EVENT_TOLERANCE_MS,
  );
}

describe("computePanchangam", () => {
  const date = new Date("2026-05-08T22:34:10Z");
  const latitude = 39.0437192;
  const longitude = -77.4874899;

  it("returns correct panchangam for amanta: Fri May 08 2026 18:34:10 GMT-0400, Virginia", () => {
    assertCommon(computePanchangam(date, latitude, longitude, "amanta"), {
      tithi: { number: 7, name: "Saptamī", paksha: "Kṛṣṇa" },
      vara: "Śukravāra",
      nakshatras: [
        { name: "Uttara Aṣāḍhā", endTime: new Date("2026-05-08T15:50:00Z") },
        { name: "Śravaṇa" },
      ],
      yogas: [{ name: "Śubha", endTime: new Date("2026-05-08T21:00:00Z") }, { name: "Śukla" }],
      karanas: [{ name: "Viṣṭi", endTime: new Date("2026-05-08T19:46:00Z") }, { name: "Bava" }],
      samvatsare: "Parābhava",
      ayana: "Uttarayana",
      ritu: "Vasanta",
      masa: "Vaiśākha",
      sunRashi: "Meṣa",
      moonRashi: "Makara",
      sunRise: new Date("2026-05-08T10:04:00Z"),
      sunSet: new Date("2026-05-08T00:10:00Z"),
    });
  });

  it("returns correct panchangam for purnimanta: Fri May 08 2026 18:34:10 GMT-0400, Virginia", () => {
    assertCommon(computePanchangam(date, latitude, longitude, "purnimanta"), {
      tithi: { number: 7, name: "Saptamī", paksha: "Kṛṣṇa" },
      vara: "Śukravāra",
      nakshatras: [
        { name: "Uttara Aṣāḍhā", endTime: new Date("2026-05-08T15:50:00Z") },
        { name: "Śravaṇa" },
      ],
      yogas: [{ name: "Śubha", endTime: new Date("2026-05-08T21:00:00Z") }, { name: "Śukla" }],
      karanas: [{ name: "Viṣṭi", endTime: new Date("2026-05-08T19:46:00Z") }, { name: "Bava" }],
      samvatsare: "Parābhava",
      ayana: "Uttarayana",
      ritu: "Vasanta",
      masa: "Jyeṣṭha",
      sunRashi: "Meṣa",
      moonRashi: "Makara",
      sunRise: new Date("2026-05-08T10:04:00Z"),
      sunSet: new Date("2026-05-08T00:10:00Z"),
    });
  });
});
