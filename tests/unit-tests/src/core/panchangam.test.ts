import { describe, it, expect } from "vitest";
import {
  computePanchangam,
  computeStarBirthday,
  type Panchangam,
} from "../../../../src/core/panchangam";

const SOLAR_EVENT_TOLERANCE_MS = 60_000;
const END_TIME_TOLERANCE_MS = 60_000;
const KALAM_TOLERANCE_MS = 60_000;

function assertCommon(result: Panchangam, expected: Panchangam) {
  expect(result.meta.sunSidereal).toBeCloseTo(expected.meta.sunSidereal, 4);
  expect(result.meta.moonSidereal).toBeCloseTo(expected.meta.moonSidereal, 4);
  expect(result.meta.elongation).toBeCloseTo(expected.meta.elongation, 4);

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

  expect(result.rahuKalam).toBeDefined();
  expect(
    Math.abs(result.rahuKalam!.start.getTime() - expected.rahuKalam!.start.getTime()),
  ).toBeLessThanOrEqual(KALAM_TOLERANCE_MS);
  expect(
    Math.abs(result.rahuKalam!.end.getTime() - expected.rahuKalam!.end.getTime()),
  ).toBeLessThanOrEqual(KALAM_TOLERANCE_MS);

  expect(result.yamaKandam).toBeDefined();
  expect(
    Math.abs(result.yamaKandam!.start.getTime() - expected.yamaKandam!.start.getTime()),
  ).toBeLessThanOrEqual(KALAM_TOLERANCE_MS);
  expect(
    Math.abs(result.yamaKandam!.end.getTime() - expected.yamaKandam!.end.getTime()),
  ).toBeLessThanOrEqual(KALAM_TOLERANCE_MS);
}

describe("computeStarBirthday", () => {
  it("returns Svātī and star birthday around May 28 2026 for birth 1990-06-05T01:22 in Thanjavur, current location Virginia", () => {
    const result = computeStarBirthday(
      new Date("Sun May 17 2026 01:33:39 GMT-0400 (Eastern Daylight Time)"),
      "1990-06-05T01:22",
      10.7860267,
      79.1381497,
      39.0437192,
      -77.4874899,
    );
    expect(result.birthNakshatra).toBe("Svātī");

    const expected = new Date("Thu May 28 2026 00:00:00 GMT-0400 (Eastern Daylight Time)");
    expect(result.starBirthday.toDateString()).toEqual(expected.toDateString());
  });

  it("returns Aśvinī and star birthday around Oct 26 2026 for birth 1990-10-06T07:20 in Thanjavur, current location Virginia", () => {
    const result = computeStarBirthday(
      new Date("Sun May 17 2026 01:33:00 GMT-0400 (Eastern Daylight Time)"),
      "1990-10-06T07:20",
      10.7860267,
      79.1381497,
      39.0437192,
      -77.4874899,
    );
    expect(result.birthNakshatra).toBe("Aśvinī");

    const expected = new Date("Wed Oct 26 2026 00:00:00 GMT-0400 (Eastern Daylight Time)");
    expect(result.starBirthday.toDateString()).toEqual(expected.toDateString());
  });
});

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
      rahuKalam: {
        start: new Date("2026-05-08T06:21:04.125Z"),
        end: new Date("2026-05-08T05:06:42.500Z"),
      },
      yamaKandam: {
        start: new Date("2026-05-08T02:37:59.250Z"),
        end: new Date("2026-05-08T01:23:37.625Z"),
      },
      meta: {
        sunSidereal: 23.60701389062405,
        moonSidereal: 277.08847648783467,
        elongation: 253.48146259721057,
      },
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
      rahuKalam: {
        start: new Date("2026-05-08T06:21:04.125Z"),
        end: new Date("2026-05-08T05:06:42.500Z"),
      },
      yamaKandam: {
        start: new Date("2026-05-08T02:37:59.250Z"),
        end: new Date("2026-05-08T01:23:37.625Z"),
      },
      meta: {
        sunSidereal: 23.60701389062405,
        moonSidereal: 277.08847648783467,
        elongation: 253.48146259721057,
      },
    });
  });
});
