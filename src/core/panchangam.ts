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

// Lahiri Ayanamsha: degrees to subtract from tropical longitude to get sidereal
function lahiriAyanamsha(T: number): number {
  return 23.85 + 1.396 * T + 0.000308 * T * T;
}

function tropicalSunLongitude(jd: number): number {
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

function tropicalMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = mod360(218.3165 + 481267.8813 * T);
  const M = mod360(134.9634 + 477198.8676 * T);
  const Ms = mod360(357.5291 + 35999.0503 * T);
  const F = mod360(93.272 + 483202.0175 * T);
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

function siderealLongitude(tropical: number, T: number): number {
  return mod360(tropical - lahiriAyanamsha(T));
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

export function computePanchangam(date: Date): Panchangam {
  const jd = toJulianDay(date);
  const T = (jd - 2451545.0) / 36525;

  const sunSidereal = siderealLongitude(tropicalSunLongitude(jd), T);
  const moonSidereal = siderealLongitude(tropicalMoonLongitude(jd), T);

  // Tithi: every 12° of elongation between sidereal moon and sun
  const elongation = mod360(moonSidereal - sunSidereal);
  const tithiIndex = Math.floor(elongation / 12); // 0–29
  const paksha: "Shukla" | "Krishna" = tithiIndex < 15 ? "Shukla" : "Krishna";
  const tithiNumber = (tithiIndex % 15) + 1;
  const tithiName =
    tithiIndex === 14 ? "Purnima" : tithiIndex === 29 ? "Amavasya" : TITHIS[tithiNumber - 1];

  // Vara: JS getDay() 0=Sun matches Ravivara
  const vara = VARAS[date.getDay()];

  // Nakshatra: 27 equal segments of 13.3333° based on sidereal moon longitude
  const nakshatraIndex = Math.floor(moonSidereal / 13.3333) % 27;
  const nakshatra = NAKSHATRAS[nakshatraIndex];

  // Yoga: combined sidereal longitudes divided into 27 segments
  const yogaSum = mod360(sunSidereal + moonSidereal);
  const yogaIndex = Math.floor(yogaSum / 13.3333) % 27;
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
    namasamvatsare: computeNamasamvatsare(date),
    ayane: computeAyane(sunSidereal),
    ritau: computeRitau(sunSidereal),
    mase: computeMase(sunSidereal),
  };
}
