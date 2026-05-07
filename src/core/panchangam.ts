// Astronomical calculations based on Jean Meeus, "Astronomical Algorithms" (2nd ed.)
// All angles in degrees unless noted. All final values use Nirayana (sidereal) longitudes.

const TITHIS = [
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
] as const;

const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishtha",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
] as const;

const VARAS = [
  "Ravivara",
  "Somavara",
  "Mangalavara",
  "Budhavara",
  "Guruvara",
  "Shukravara",
  "Shanivara",
] as const;

const YOGAS = [
  "Vishkambha",
  "Priti",
  "Ayushman",
  "Saubhagya",
  "Shobhana",
  "Atiganda",
  "Sukarma",
  "Dhriti",
  "Shula",
  "Ganda",
  "Vriddhi",
  "Dhruva",
  "Vyaghata",
  "Harshana",
  "Vajra",
  "Siddhi",
  "Vyatipata",
  "Variyana",
  "Parigha",
  "Shiva",
  "Siddha",
  "Sadhya",
  "Shubha",
  "Shukla",
  "Brahma",
  "Indra",
  "Vaidhriti",
] as const;

// The 7 repeating karanas cycling through indices 1–56 in a lunar month
const REPEATING_KARANAS = [
  "Bava",
  "Balava",
  "Kaulava",
  "Taitila",
  "Garaja",
  "Vanija",
  "Vishti",
] as const;

const SAMVATSARAS = [
  "Prabhava",
  "Vibhava",
  "Shukla",
  "Pramoda",
  "Prajapati",
  "Angiras",
  "Shrimukha",
  "Bhava",
  "Yuva",
  "Dhata",
  "Ishvara",
  "Bahudhanya",
  "Pramathi",
  "Vikrama",
  "Vrisha",
  "Chitrabhanu",
  "Subhanu",
  "Tarana",
  "Parthiva",
  "Vyaya",
  "Sarvajit",
  "Sarvadhari",
  "Virodhi",
  "Vikrita",
  "Khara",
  "Nandana",
  "Vijaya",
  "Jaya",
  "Manmatha",
  "Durmukhi",
  "Hevilambi",
  "Vilambi",
  "Vikari",
  "Sharvari",
  "Plava",
  "Shubhakruta",
  "Shobhakruta",
  "Krodhi",
  "Vishvavasu",
  "Parabhava",
  "Plavanga",
  "Kilaka",
  "Saumya",
  "Sadharana",
  "Virodhikruta",
  "Paridhavi",
  "Pramadicha",
  "Ananda",
  "Rakshasa",
  "Nala",
  "Pingala",
  "Kalayukti",
  "Siddharthi",
  "Raudra",
  "Durmathi",
  "Dundubhi",
  "Rudhirodgari",
  "Raktakshi",
  "Krodhana",
  "Kshaya",
] as const;

const MASAS = [
  "Chaitra",
  "Vaishakha",
  "Jyeshtha",
  "Ashadha",
  "Shravana",
  "Bhadrapada",
  "Ashvina",
  "Kartika",
  "Margashirsha",
  "Pausha",
  "Magha",
  "Phalguna",
] as const;

const RITUS = ["Vasanta", "Grishma", "Varsha", "Sharada", "Hemanta", "Shishira"] as const;

const NAKSHATRA_WIDTH = 360 / 27;
const ZENITH_UPPER_LIMB = 90.8333; // Drik Panchang Default (Refraction + Semi-diameter)
const ZENITH_CENTER = 90.5833; // "Middle Limb" Sunrise

function dayOfYear(date: Date): number {
  const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.floor((date.getTime() - startOfYear.getTime()) / 86400000) + 1;
}

function toJulianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d =
    date.getUTCDate() +
    date.getUTCHours() / 24 +
    date.getUTCMinutes() / 1440 +
    date.getUTCSeconds() / 86400;

  const A = Math.floor((14 - m) / 12);
  const Y = y + 4800 - A;
  const M = m + 12 * A - 3;

  return (
    d +
    Math.floor((153 * M + 2) / 5) +
    365 * Y +
    Math.floor(Y / 4) -
    Math.floor(Y / 100) +
    Math.floor(Y / 400) -
    32045
  );
}

/**
 * Converts a Julian Day to Julian Centuries since the J2000.0 epoch.
 * Used as the time variable 'T' in astronomical polynomial series.
 * @param jd The Julian Day number
 */
function toJulianCenturies(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}

function mod360(x: number): number {
  return ((x % 360) + 360) % 360;
}

// Lahiri (Chitrapaksha) Ayanamsha: degrees to subtract from tropical longitude to get sidereal
function getTrueAyanamsha(T: number): number {
  // 1. Mean Ayanamsha
  const A_m = 23.85944 + 1.396333 * T + 0.0003088 * T * T;

  // 2. Nutation Correction
  // This corrects the wobble that often pushes the Moon into the next Nakshatra
  const omega = toRad(125.04452 - 1934.136261 * T); // Node of the Moon
  const L = toRad(280.4665 + 36000.7698 * T); // Mean Longitude of Sun
  const nutation = (-17.2 * Math.sin(omega) - 1.32 * Math.sin(2 * L)) / 3600;

  const A = A_m + nutation;
  return A;
}

function toRad(degree: number): number {
  return (degree * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function siderealSunLongitude(jd: number): number {
  const T = toJulianCenturies(jd);
  const A = getTrueAyanamsha(T);

  const L0 = mod360(280.46646 + 36000.76983 * T) + 0.0003032 * T * T;
  const M = mod360(357.5291092 + 35999.0502909 * T - 0.0001537 * T * T);
  const Mrad = toRad(M);
  const C =
    (1.914602 - 0.004817 * T) * Math.sin(Mrad) +
    0.019993 * Math.sin(2 * Mrad) +
    0.000101 * Math.sin(3 * Mrad);

  return mod360(L0 + C - A);
}

function siderealMoonLongitude(jd: number): number {
  const T = toJulianCenturies(jd);
  const A = getTrueAyanamsha(T);

  // 1. Calculate Fundamental Arguments in Degrees (as per spec)
  const LP_deg = 218.3164477 + 481267.8812307 * T; // Mean Longitude
  const D_deg = 297.8501921 + 445267.1114034 * T; // Mean Elongation
  const MP_deg = 357.5291092 + 35999.0502909 * T; // Sun's Mean Anomaly
  const M_deg = 134.9633964 + 477198.8675055 * T; // Moon's Mean Anomaly
  const F_deg = 93.272095 + 483202.0175233 * T; // Moon's Argument of Latitude

  // 2. Convert to Radians for Trigonometric input (Strict Spec Adherence)
  const D = toRad(mod360(D_deg));
  const MP = toRad(mod360(MP_deg));
  const M = toRad(mod360(M_deg));
  const F = toRad(mod360(F_deg));

  // Eccentricity of Earth's orbit (needed for solar-related terms)
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;

  // 3. Periodic Correction (L_corr)
  // All inputs to Math.sin are now pre-calculated Radians
  const L_corr =
    6288774 * Math.sin(M) +
    1274027 * Math.sin(2 * D - M) +
    658314 * Math.sin(2 * D) +
    213618 * Math.sin(2 * M) -
    185116 * E * Math.sin(MP) - // Solar influence
    114332 * Math.sin(2 * F) +
    58793 * Math.sin(2 * D - 2 * M) +
    57066 * E * Math.sin(2 * D - MP - M) +
    53322 * Math.sin(2 * D + M) +
    45758 * E * Math.sin(2 * D - MP) -
    40923 * E * Math.sin(M - MP) -
    34720 * Math.sin(D) -
    30383 * E * Math.sin(MP + M) +
    15327 * Math.sin(2 * D - 2 * F); // Added term for inclination/node

  // 3. Final Sidereal Calculation
  const siderealMoon = mod360(LP_deg + L_corr / 1000000 - A);
  return siderealMoon;
}

// Returns the Date of local sunrise for a given UTC calendar day using the NOAA zenith algorithm.
// Falls back to solar noon if the sun never rises/sets (polar regions).
function computeSunriseDateForDay(
  date: Date,
  latitude: number,
  longitude: number,
  zenith: number = ZENITH_UPPER_LIMB,
): Date {
  const N = dayOfYear(date);
  const t = N + (6 - longitude / 15) / 24;

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

  // H in hours for sunrise (west side of meridian)
  const H = cosH >= 1 || cosH <= -1 ? 12 : mod360(360 - toDeg(Math.acos(cosH))) / 15;

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

export interface Panchangam {
  tithi: { number: number; name: string; paksha: "Shukla" | "Krishna" };
  vara: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  namasamvatsare: string;
  ayane: "Uttarayana" | "Dakshinayana";
  ritau: string;
  mase: string;
}

function computeNamasamvatsare(date: Date): string {
  // North Indian / Shaka-based Jovian cycle. Shaka era starts 78 CE.
  // New year begins at Chaitra Shukla Pratipada (~Mar 22); subtract 1 before that.
  const gregYear = date.getUTCFullYear();
  const isAfterChaitraStart =
    date.getUTCMonth() > 2 || (date.getUTCMonth() === 2 && date.getUTCDate() >= 22);
  const shakaYear = isAfterChaitraStart ? gregYear - 78 : gregYear - 79;
  const index = (((shakaYear + 12) % 60) + 60) % 60;
  return SAMVATSARAS[index];
}

function computeAyane(sunSidereal: number): "Uttarayana" | "Dakshinayana" {
  // Uttarayana: Sun in sidereal Capricorn [270°, 360°) through Gemini [0°, 90°)
  return sunSidereal < 90 || sunSidereal >= 270 ? "Uttarayana" : "Dakshinayana";
}

function computeRitau(sunSidereal: number): string {
  const index = Math.floor(sunSidereal / 60) % 6;
  return RITUS[index];
}

function computeMase(sunSidereal: number): string {
  const index = Math.floor(sunSidereal / 30) % 12;
  return MASAS[index];
}

function computeKarana(karanaIndex: number): string {
  // 60 karanas per lunar month (index 0–59)
  // Fixed: index 0 = Kimstughna, 57 = Shakuni, 58 = Chatushpada, 59 = Naga
  // Repeating: indices 1–56 cycle through 7 names
  if (karanaIndex === 0) return "Kimstughna";
  if (karanaIndex === 57) return "Shakuni";
  if (karanaIndex === 58) return "Chatushpada";
  if (karanaIndex === 59) return "Naga";
  return REPEATING_KARANAS[(karanaIndex - 1) % 7];
}

export function computePanchangam(date: Date, latitude?: number, longitude?: number): Panchangam {
  const sunriseDate =
    latitude !== undefined && longitude !== undefined
      ? computeGoverningSunrise(date, latitude, longitude)
      : date;

  const jd = toJulianDay(sunriseDate);
  const sunSidereal = siderealSunLongitude(jd);
  const moonSidereal = siderealMoonLongitude(jd);

  // Tithi: every 12° of elongation between sidereal moon and sun
  const elongation = mod360(moonSidereal - sunSidereal);
  const tithiIndex = Math.floor(elongation / 12); // 0–29
  const paksha: "Shukla" | "Krishna" = tithiIndex < 15 ? "Shukla" : "Krishna";
  const tithiNumber = (tithiIndex % 15) + 1;
  const tithiName =
    tithiIndex === 14 ? "Purnima" : tithiIndex === 29 ? "Amavasya" : TITHIS[tithiNumber - 1];

  // Vara derived from sunrise date so pre-sunrise inputs resolve to the previous solar day
  const vara = VARAS[sunriseDate.getUTCDay()];

  // Nakshatra: 27 equal segments using exact 360/27 to avoid cumulative rounding errors
  const nakshatraIndex = Math.floor(moonSidereal / NAKSHATRA_WIDTH) % 27;
  const nakshatra = NAKSHATRAS[nakshatraIndex];

  // Yoga: combined sidereal longitudes divided into 27 segments
  const yogaSum = mod360(sunSidereal + moonSidereal);
  console.log({ yogaSum, sunSidereal, moonSidereal, date });
  const yogaIndex = Math.floor(yogaSum / NAKSHATRA_WIDTH) % 27;
  const yoga = YOGAS[yogaIndex];

  // Karana: every 6° of elongation = one karana; 60 total per lunar month
  const karanaIndex = Math.floor(elongation / 6) % 60;
  const karana = computeKarana(karanaIndex);

  return {
    tithi: { number: tithiNumber, name: tithiName, paksha },
    vara,
    nakshatra,
    yoga,
    karana,
    namasamvatsare: computeNamasamvatsare(sunriseDate),
    ayane: computeAyane(sunSidereal),
    ritau: computeRitau(sunSidereal),
    mase: computeMase(sunSidereal),
  };
}
