// Astronomical calculations based on Jean Meeus, "Astronomical Algorithms" (2nd ed.)
// All angles in degrees unless noted.

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
  "Purnima / Amavasya",
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

const KARANAS = [
  "Bava",
  "Balava",
  "Kaulava",
  "Taitila",
  "Garaja",
  "Vanija",
  "Vishti",
  "Bhadra",
] as const;

const SAMVATSARAS = [
  "Prabhava", "Vibhava", "Shukla", "Pramoda", "Prajapati",
  "Angiras", "Shrimukha", "Bhava", "Yuva", "Dhata",
  "Ishvara", "Bahudhanya", "Pramathi", "Vikrama", "Vrisha",
  "Chitrabhanu", "Subhanu", "Tarana", "Parthiva", "Vyaya",
  "Sarvajit", "Sarvadhari", "Virodhi", "Vikrita", "Khara",
  "Nandana", "Vijaya", "Jaya", "Manmatha", "Durmukhi",
  "Hevilambi", "Vilambi", "Vikari", "Sharvari", "Plava",
  "Shubhakruta", "Shobhakruta", "Krodhi", "Vishvavasu", "Parabhava",
  "Plavanga", "Kilaka", "Saumya", "Sadharana", "Virodhikruta",
  "Paridhavi", "Pramadicha", "Ananda", "Rakshasa", "Nala",
  "Pingala", "Kalayukti", "Siddharthi", "Raudra", "Durmathi",
  "Dundubhi", "Rudhirodgari", "Raktakshi", "Krodhana", "Kshaya",
] as const;

const MASAS = [
  "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha",
  "Shravana", "Bhadrapada", "Ashvina", "Kartika",
  "Margashirsha", "Pausha", "Magha", "Phalguna",
] as const;

const RITUS = [
  "Vasanta", "Grishma", "Varsha", "Sharada", "Hemanta", "Shishira",
] as const;

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

function mod360(x: number): number {
  return ((x % 360) + 360) % 360;
}

function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = mod360(280.46646 + 36000.76983 * T);
  const M = mod360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = (M * Math.PI) / 180;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);
  return mod360(L0 + C);
}

function moonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  // Moon's mean longitude
  const L = mod360(218.3165 + 481267.8813 * T);
  // Moon's mean anomaly
  const M = mod360(134.9634 + 477198.8676 * T);
  // Sun's mean anomaly
  const Ms = mod360(357.5291 + 35999.0503 * T);
  // Moon's argument of latitude
  const F = mod360(93.272 + 483202.0175 * T);
  // Elongation
  const D = mod360(297.8502 + 445267.1115 * T);

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const correction =
    6.288774 * Math.sin(toRad(M)) +
    1.274027 * Math.sin(toRad(2 * D - M)) +
    0.658314 * Math.sin(toRad(2 * D)) +
    0.213618 * Math.sin(toRad(2 * M)) -
    0.185116 * Math.sin(toRad(Ms)) -
    0.114332 * Math.sin(toRad(2 * F)) +
    0.058793 * Math.sin(toRad(2 * D - 2 * M)) +
    0.057066 * Math.sin(toRad(2 * D - Ms - M)) +
    0.053322 * Math.sin(toRad(2 * D + M)) +
    0.045758 * Math.sin(toRad(2 * D - Ms)) -
    0.040923 * Math.sin(toRad(Ms - M)) -
    0.03472 * Math.sin(toRad(D)) -
    0.030383 * Math.sin(toRad(Ms + M));

  return mod360(L + correction);
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
  // Vikram Samvat year starts on Chaitra Shukla Pratipada (~Mar 22–Apr 15).
  // Approximate: VS year = Gregorian year + 57 on/after Mar 22, else + 56.
  const gregYear = date.getFullYear();
  const isAfterChaitraStart =
    date.getMonth() > 2 || (date.getMonth() === 2 && date.getDate() >= 22);
  const vsYear = isAfterChaitraStart ? gregYear + 57 : gregYear + 56;
  const index = (vsYear - 1) % 60;
  return SAMVATSARAS[index];
}

function computeAyane(sunLong: number): "Uttarayana" | "Dakshinayana" {
  // Uttarayana: Sun in [270°, 360°) or [0°, 90°) — moving northward
  // Dakshinayana: Sun in [90°, 270°) — moving southward
  return sunLong < 90 || sunLong >= 270 ? "Uttarayana" : "Dakshinayana";
}

function computeRitau(sunLong: number): string {
  // Six seasons, each spanning 60° of solar longitude starting from Mesha (0°)
  const index = Math.floor(sunLong / 60) % 6;
  return RITUS[index];
}

function computeMase(sunLong: number): string {
  // Saura masa: solar month determined by sun's rashi (30° segments from Mesha)
  const index = Math.floor(sunLong / 30) % 12;
  return MASAS[index];
}

export function computePanchangam(date: Date): Panchangam {
  const jd = toJulianDay(date);
  const sunLong = sunLongitude(jd);
  const moonLong = moonLongitude(jd);

  // Tithi: every 12° of elongation = one tithi (1–30)
  const elongation = mod360(moonLong - sunLong);
  const tithiIndex = Math.floor(elongation / 12); // 0–29
  const paksha = tithiIndex < 15 ? "Shukla" : "Krishna";
  const tithiInPaksha = (tithiIndex % 15) + 1;
  const tithiName =
    tithiInPaksha === 15
      ? paksha === "Shukla"
        ? "Purnima"
        : "Amavasya"
      : TITHIS[tithiInPaksha - 1];

  // Vara: JS getDay() is 0=Sun which matches Ravivara
  const vara = VARAS[date.getDay()];

  // Nakshatra: 27 segments of 360° based on moon longitude
  const nakshatraIndex = Math.floor((moonLong / 360) * 27) % 27;
  const nakshatra = NAKSHATRAS[nakshatraIndex];

  // Yoga: (sun + moon) longitude divided into 27 segments
  const yogaIndex = Math.floor((mod360(sunLong + moonLong) / 360) * 27) % 27;
  const yoga = YOGAS[yogaIndex];

  // Karana: every 6° of elongation = one karana; first 4 of each fortnight cycle through fixed set
  const karanaIndex = Math.floor(elongation / 6) % 8;
  const karana = KARANAS[karanaIndex];

  return {
    tithi: { number: tithiInPaksha, name: tithiName, paksha },
    vara,
    nakshatra,
    yoga,
    karana,
    namasamvatsare: computeNamasamvatsare(date),
    ayane: computeAyane(sunLong),
    ritau: computeRitau(sunLong),
    mase: computeMase(sunLong),
  };
}
