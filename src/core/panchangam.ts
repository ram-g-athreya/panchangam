// All angles in degrees unless noted. All final values use Nirayana (sidereal) longitudes.
import { Astrosk, SE } from "astrosk-wasm";
import type { LunarSystem } from "../constants";

const astrosk = await Astrosk.init();
astrosk.setSidMode(1, 0, 0);

type Paksha = "Śukla" | "Kṛṣṇa";
type Ayana = "Uttarayana" | "Dakshinayana";

interface Tithi {
  number: number;
  name: string;
  paksha: Paksha;
  endTime?: Date;
}

interface Karana {
  name: string;
  endTime?: Date;
}

interface Nakshatra {
  name: string;
  endTime?: Date;
}

interface Yoga {
  name: string;
  endTime?: Date;
}

export interface Panchangam {
  tithi: Tithi;
  vara: string;
  nakshatras: Nakshatra[];
  yogas: Yoga[];
  karanas: Karana[];
  samvatsare: string;
  ayana: Ayana;
  ritu: string;
  masa: string;
  sunRise?: Date;
  sunSet?: Date;
}

const TITHIS = [
  "Pratipadā",
  "Dvitīyā",
  "Tṛtīyā",
  "Caturthī",
  "Pañcamī",
  "Ṣaṣṭhī",
  "Saptamī",
  "Aṣṭamī",
  "Navamī",
  "Daśamī",
  "Ekādaśī",
  "Dvādaśī",
  "Trayodaśī",
  "Caturdaśī",
] as const;

const NAKSHATRAS = [
  "Aśvinī",
  "Bharaṇī",
  "Kṛttikā",
  "Rohiṇī",
  "Mṛgaśirā",
  "Ārdrā",
  "Punarvasu",
  "Puṣya",
  "Āśleṣā",
  "Maghā",
  "Pūrva Phalgunī",
  "Uttara Phalgunī",
  "Hasta",
  "Citrā",
  "Svātī",
  "Viśākhā",
  "Anurādhā",
  "Jyeṣṭhā",
  "Mūlā",
  "Pūrvāṣāḍhā",
  "Uttarāṣāḍhā",
  "Śravaṇa",
  "Dhaniṣṭhā",
  "Śatabhiṣā",
  "Pūrvabhādrapadā",
  "Uttarabhādrapadā",
  "Revatī",
] as const;

const VARA = [
  "Ravivāra",
  "Somavāra",
  "Maṅgalavāra",
  "Budhavāra",
  "Guruvāra",
  "Śukravāra",
  "Śanivāra",
] as const;

const YOGAS = [
  "Viṣkambha",
  "Prīti",
  "Āyuṣmān",
  "Saubhāgya",
  "Śobhana",
  "Atigaṇḍa",
  "Sukarma",
  "Dhṛti",
  "Śūla",
  "Gaṇḍa",
  "Vṛddhi",
  "Dhruva",
  "Vyāghāta",
  "Harṣaṇa",
  "Vajra",
  "Siddhi",
  "Vyatīpāta",
  "Varīyān",
  "Parigha",
  "Śiva",
  "Siddha",
  "Sādhya",
  "Śubha",
  "Śukla",
  "Brahma",
  "Indra",
  "Vaidhṛti",
] as const;

// The 7 repeating karanas cycling through indices 1–56 in a lunar month
const REPEATING_KARANAS = [
  "Bava",
  "Bālava",
  "Kaulava",
  "Taitila",
  "Garaja",
  "Vaṇija",
  "Viṣṭi",
] as const;

const SAMVATSARAS = [
  "Prabhava",
  "Vibhava",
  "Śukla",
  "Pramoda",
  "Prajāpati",
  "Aṅgiras",
  "Śrīmukha",
  "Bhava",
  "Yuva",
  "Dhātṛ", // Often written as Dhātā
  "Īśvara",
  "Bahudhānya",
  "Pramāthin",
  "Vikrama",
  "Vṛṣa",
  "Citrabhānu",
  "Subhānu",
  "Tāraṇa",
  "Pārthiva",
  "Vyaya",
  "Sarvajit",
  "Sarvadhārin",
  "Virodhin",
  "Vikṛta",
  "Khara",
  "Nandana",
  "Vijaya",
  "Jaya",
  "Manmatha",
  "Durmukha",
  "Hevilambī",
  "Vilambī",
  "Vikārī",
  "Śarvarī",
  "Plava",
  "Śubhakṛta",
  "Śobhakṛta",
  "Krodhī",
  "Viśvāvasu",
  "Parābhava",
  "Plavaṅga",
  "Kīlaka",
  "Saumya",
  "Sādhāraṇa",
  "Virodhakṛta",
  "Paridhāvī",
  "Pramādī",
  "Ānanda",
  "Rākṣasa",
  "Nala",
  "Piṅgala",
  "Kālayukti",
  "Siddhārthī",
  "Raudra",
  "Durmati",
  "Dundubhi",
  "Rudhirodgārī",
  "Raktākṣī",
  "Krodhana",
  "Akṣaya", // Also known as Kṣaya
] as const;

const MASAS = [
  "Caitra",
  "Vaiśākha",
  "Jyeṣṭha",
  "Āṣāḍha",
  "Śrāvaṇa",
  "Bhādrapada",
  "Āśvina",
  "Kārttika",
  "Mārgaśīrṣa",
  "Pauṣa",
  "Māgha",
  "Phālguna",
] as const;

const RASHIS = [
  "Meṣa", // Aries
  "Vṛṣabha", // Taurus
  "Mithuna", // Gemini
  "Karka", // Cancer
  "Siṃha", // Leo
  "Kanyā", // Virgo
  "Tulā", // Libra
  "Vṛścika", // Scorpio
  "Dhanu", // Sagittarius
  "Makara", // Capricorn
  "Kumbha", // Aquarius
  "Mīna", // Pisces
] as const;

const RITUS = ["Vasanta", "Grīṣma", "Varṣā", "Śarada", "Hemanta", "Śiśira"] as const;

const NAKSHATRA_WIDTH = 360 / 27;
const ZENITH_UPPER_LIMB = 90.8333; // 90°50' — upper limb + atmospheric refraction

/**
 * Average speeds in degrees per day
 */
const SPEED_MOON = 13.17639;
const SPEED_ELONGATION = 12.19075; // Moon - Sun
const SPEED_YOGA = 14.162; // Moon + Sun

type PanchangElement = "TITHI" | "NAKSHATRA" | "YOGA" | "KARANA";

function dayOfYear(date: Date): number {
  const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.floor((date.getTime() - startOfYear.getTime()) / 86400000) + 1;
}

const toJulianDay = (date: Date): number =>
  astrosk.utcToJd({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
  }).jdUt;

function julianDayToDate(jd: number) {
  const { year, month, day, hour: decimalHour } = astrosk.revjul(jd);
  const h = Math.floor(decimalHour);

  const mFull = (decimalHour - h) * 60;
  const m = Math.floor(mFull);

  const sFull = (mFull - m) * 60;
  const s = Math.floor(sFull);
  const ms = Math.round((sFull - s) * 1000);
  return new Date(Date.UTC(year, month - 1, day, h, m, s, ms));
}

/**
 * Converts a Julian Day to Julian Centuries since the J2000.0 epoch.
 * Used as the time variable 'T' in astronomical polynomial series.
 * @param jd The Julian Day number
 */
function toJulianCenturies(jd: number): number {
  // In 2026, Delta T is roughly 69.4 seconds.
  // We convert seconds to days: 69.4 / 86400
  const deltaT = 69.4 / 86400;
  const jdTT = jd + deltaT;
  return (jdTT - 2451545.0) / 36525;
}

const mod360 = (x: number): number => ((x % 360) + 360) % 360;
const toRad = (degree: number): number => (degree * Math.PI) / 180;
const toDeg = (rad: number): number => (rad * 180) / Math.PI;

const siderealSunLongitude = (jd: number, flags = SE.FLG.SWIEPH | SE.FLG.SIDEREAL): number =>
  astrosk.calcUt(jd, SE.SUN, flags).longitude;

const siderealMoonLongitude = (jd: number, flags = SE.FLG.SWIEPH | SE.FLG.SIDEREAL): number =>
  astrosk.calcUt(jd, SE.MOON, flags).longitude;

// NOAA zenith algorithm for sunrise (isRise=true) or sunset (isRise=false).
// Falls back to solar noon/midnight if the sun never rises/sets (polar regions).
function computeSolarEventDateForDay(
  date: Date,
  latitude: number,
  longitude: number,
  isRise: boolean,
  zenith: number = ZENITH_UPPER_LIMB,
): Date {
  const N = dayOfYear(date);
  const t = N + ((isRise ? 6 : 18) - longitude / 15) / 24;

  const M = mod360(0.9856 * t - 3.289);
  const Mrad = toRad(M);
  const L = mod360(M + 1.916 * Math.sin(Mrad) + 0.02 * Math.sin(2 * Mrad) + 282.634);
  const Lrad = toRad(L);

  // Right Ascension — atan result adjusted to same 90° quadrant as L, then converted to hours
  let RA = toDeg(Math.atan(0.91764 * Math.tan(Lrad)));
  const Lquad = Math.floor(L / 90) * 90;
  const RAquad = Math.floor(RA / 90) * 90;
  RA = (RA + (Lquad - RAquad)) / 15;

  const sinDec = 0.39782 * Math.sin(Lrad);
  const cosDec = Math.sqrt(1 - sinDec * sinDec);

  const cosH =
    (Math.cos(toRad(zenith)) - sinDec * Math.sin(toRad(latitude))) /
    (cosDec * Math.cos(toRad(latitude)));

  // Sunrise: west side of meridian (360 - acos); sunset: east side (acos)
  const H =
    cosH >= 1 || cosH <= -1
      ? 12
      : isRise
        ? mod360(360 - toDeg(Math.acos(cosH))) / 15
        : toDeg(Math.acos(cosH)) / 15;

  const utcHours = (((H + RA - 0.06571 * t - 6.622 - longitude / 15) % 24) + 24) % 24;

  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      Math.floor(utcHours),
      Math.floor((utcHours % 1) * 60),
      Math.floor(((utcHours * 60) % 1) * 60),
    ),
  );
}

function computeSunriseDateForDay(
  date: Date,
  latitude: number,
  longitude: number,
  zenith: number = ZENITH_UPPER_LIMB,
): Date {
  return computeSolarEventDateForDay(date, latitude, longitude, true, zenith);
}

function computeSunsetDateForDay(
  date: Date,
  latitude: number,
  longitude: number,
  zenith: number = ZENITH_UPPER_LIMB,
): Date {
  return computeSolarEventDateForDay(date, latitude, longitude, false, zenith);
}

// Returns the governing sunrise Date for a given moment.
// If the moment is before today's sunrise, the previous day's sunrise governs.
function computeGoverningSunrise(date: Date, latitude: number, longitude: number): Date {
  const todaySunrise = computeSunriseDateForDay(date, latitude, longitude);
  if (date.getTime() < todaySunrise.getTime()) {
    const yesterday = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - 1),
    );
    return computeSunriseDateForDay(yesterday, latitude, longitude);
  }
  return todaySunrise;
}

function computeSamvatsare(date: Date): string {
  const jd = toJulianDay(date);
  const T = toJulianCenturies(jd);

  /**
   * 1. Calculate Jupiter's Mean Longitude (L_j)
   * This is the standard formula for Jupiter's average position.
   */
  const L_j = 34.3964407 + 3034.9056746 * T + 0.00010547 * T * T;

  /**
   * 2. Calculate the Samvatsara Index
   * - One Samvatsara = Jupiter traversing 1 Rashi (30°).
   * - One 60-year cycle = 5 full revolutions of Jupiter (1800° total).
   * - 11.9 is the offset to align this astronomical motion with the
   *   J2000 epoch
   */
  const S_elapsed = L_j / 30 + 11.9;

  // The floor value gives the current Samvatsara in the 0-59 sequence
  const index = Math.floor(S_elapsed) % 60;

  return SAMVATSARAS[index];
}

function computeAyana(sunSidereal: number): "Uttarayana" | "Dakshinayana" {
  // Uttarayana: Sun in sidereal Capricorn [270°, 360°) through Gemini [0°, 90°)
  return sunSidereal < 90 || sunSidereal >= 270 ? "Uttarayana" : "Dakshinayana";
}

function computeRitu(sunSidereal: number): string {
  const index = Math.floor(sunSidereal / 60) % 6;
  return RITUS[index];
}

function computeMasa(sunSidereal: number, elongation: number, lunarSystem: LunarSystem): string {
  /**
   * 1. Calculate Sun's position at the last New Moon.
   * Elongation increases by ~12.19° per day, while the Sun moves ~0.98° per day.
   * The ratio of Sun motion to Elongation motion is roughly 0.0808.
   */
  const S_nm = mod360(sunSidereal - elongation * 0.0808);

  /**
   * 2. Determine the Masa Index.
   * In the standard mapping:
   * Sun in Mesha (0°-30°) at New Moon = Vaishakha
   * Sun in Meena (330°-360°) at New Moon = Chaitra
   *
   * Since the MASAS array starts with Chaitra (Index 0), we shift the index.
   */
  const R_nm = Math.floor(S_nm / 30); // 0 = Mesha, 11 = Meena
  let masaIndex = (R_nm + 1) % 12;
  if (lunarSystem === "purnimanta") masaIndex = (masaIndex + 1) % 12;

  return MASAS[masaIndex];
}

const getPanchangSegment = (jd: number, type: PanchangElement) => {
  const s = siderealSunLongitude(jd);
  const m = siderealMoonLongitude(jd);
  switch (type) {
    case "TITHI":
      return mod360(m - s);
    case "NAKSHATRA":
      return m;
    case "YOGA":
      return mod360(m + s);
    case "KARANA":
      return mod360(m - s);
  }
};

function findEndTime(jd: number, type: PanchangElement): Date {
  let currentJD = jd;
  const threshold = 0.000001; // Accuracy in days (~0.08 seconds)

  // Determine width and speed
  const width =
    type === "KARANA" ? 6 : type === "NAKSHATRA" || type === "YOGA" ? NAKSHATRA_WIDTH : 12;

  const avgSpeed =
    type === "NAKSHATRA" ? SPEED_MOON : type === "YOGA" ? SPEED_YOGA : SPEED_ELONGATION;

  const currentVal = getPanchangSegment(currentJD, type);
  const nextBoundary = (Math.floor(currentVal / width) + 1) * width;

  // Iterative refinement (Secant-like method)
  for (let i = 0; i < 5; i++) {
    const valAtPoint = getPanchangSegment(currentJD, type);
    let distance = nextBoundary - valAtPoint;

    // Handle 360/0 degree wrap-around
    if (distance <= 0) distance += 360;
    // Safety check: if distance is huge, we might be looking at the wrong cycle
    if (distance > width + 2) distance -= 360;

    const daysToWait = distance / avgSpeed;
    currentJD += daysToWait;

    if (Math.abs(daysToWait) < threshold) break;
  }

  return julianDayToDate(currentJD);
}

function computeKarana(karanaIndex: number): Karana {
  // 60 karanas per lunar month (index 0–59)
  // Fixed: index 0 = Kimstughna, 57 = Shakuni, 58 = Chatushpada, 59 = Naga
  // Repeating: indices 1–56 cycle through 7 names
  if (karanaIndex === 0) return { name: "Kimstughna" };
  if (karanaIndex === 57) return { name: "Shakuni" };
  if (karanaIndex === 58) return { name: "Chatushpada" };
  if (karanaIndex === 59) return { name: "Naga" };
  return {
    name: REPEATING_KARANAS[(karanaIndex - 1) % 7],
  };
}

function computeTithi(elongation: number): Tithi {
  const tithiIndex = Math.floor(elongation / 12); // 0–29
  const paksha: Paksha = tithiIndex < 15 ? "Śukla" : "Kṛṣṇa";
  const tithiNumber = (tithiIndex % 15) + 1;
  const tithiName =
    tithiIndex === 14 ? "Pūrṇimā" : tithiIndex === 29 ? "Amāvasyā" : TITHIS[tithiNumber - 1];
  return {
    number: tithiNumber,
    name: tithiName,
    paksha,
  };
}

export function computePanchangam(
  date: Date,
  latitude?: number,
  longitude?: number,
  lunarSystem: LunarSystem = "amanta",
  useSunrise: boolean = true,
): Panchangam {
  const hasCoords = latitude !== undefined && longitude !== undefined;
  const sunDate = hasCoords ? computeGoverningSunrise(date, latitude, longitude) : date;
  const sunRise = hasCoords ? computeGoverningSunrise(date, latitude!, longitude!) : undefined;
  const sunSet = hasCoords ? computeSunsetDateForDay(date, latitude!, longitude!) : undefined;

  const jd = toJulianDay(useSunrise ? (sunRise ?? date) : date);
  const sunSidereal = siderealSunLongitude(jd);
  const moonSidereal = siderealMoonLongitude(jd);

  // Tithi: every 12° of elongation between sidereal moon and sun
  const elongation = mod360(moonSidereal - sunSidereal);

  // Vasara derived from sunrise date so pre-sunrise inputs resolve to the previous solar day
  const vara = VARA[sunDate.getUTCDay()];

  // Nakshatra: 27 equal segments using exact 360/27 to avoid cumulative rounding errors
  const nakshatraIndex = Math.floor(moonSidereal / NAKSHATRA_WIDTH) % 27;
  const nakshatras: Nakshatra[] = [
    { name: NAKSHATRAS[nakshatraIndex], endTime: findEndTime(jd, "NAKSHATRA") },
    { name: NAKSHATRAS[(nakshatraIndex + 1) % 27] },
  ];

  const yogaSum = mod360(sunSidereal + moonSidereal);
  const yogaIndex = Math.floor(yogaSum / NAKSHATRA_WIDTH) % 27;
  const yogas: Yoga[] = [
    { name: YOGAS[yogaIndex], endTime: findEndTime(jd, "YOGA") },
    { name: YOGAS[(yogaIndex + 1) % 27] },
  ];

  // Karana: every 6° of elongation = one karana; 60 total per lunar month
  const karanaIndex = Math.floor(elongation / 6) % 60;
  const karanas: Karana[] = [
    { ...computeKarana(karanaIndex), endTime: findEndTime(jd, "KARANA") },
    { ...computeKarana((karanaIndex + 1) % 60) },
  ];

  return {
    tithi: computeTithi(elongation),
    vara,
    nakshatras,
    yogas,
    karanas,
    samvatsare: computeSamvatsare(sunDate),
    ayana: computeAyana(sunSidereal),
    ritu: computeRitu(sunSidereal),
    masa: computeMasa(sunSidereal, elongation, lunarSystem),
    sunRise,
    sunSet,
  };
}
