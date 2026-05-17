import { useState, useEffect, useMemo, useRef } from "react";
import { CitySearch } from "../components/CitySearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faStar,
  faInfinity,
  faScaleBalanced,
  faCalendarDays,
  faSeedling,
  faCloudBolt,
  faLeaf,
  faWind,
  faSnowflake,
  faSun,
  faMoon,
  faAries,
  faTaurus,
  faGemini,
  faCancer,
  faLeo,
  faVirgo,
  faLibra,
  faScorpio,
  faSagittarius,
  faCapricorn,
  faAquarius,
  faPisces,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { SunriseFill, SunsetFill, EmojiSunglassesFill } from "react-bootstrap-icons";
import { computePanchangam, computeStarBirthday } from "../core/panchangam";
import type { StarBirthdayResult } from "../core/panchangam";
import type { TimeFormat, LocationData, LunarSystem } from "../constants";
import { LOCATION_KEY, STAR_BIRTHDAY_KEY } from "../constants";
import "../styles/DailyView.css";

interface DailyViewProps {
  timeFormat: TimeFormat;
  lunarSystem: LunarSystem;
}

const getMoonPhaseImage = (number: number, paksha: string): string => {
  return encodeURI(`/images/moon-phases/${number}_${paksha}.webp`);
};

function getLocation(): LocationData | null {
  const stored = localStorage.getItem(LOCATION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as LocationData;
  } catch {
    return null;
  }
}

function formatTime(date: Date, format: TimeFormat): string {
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  if (format === "24h") {
    const hh = String(date.getHours()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }
  const raw = date.getHours();
  const ampm = raw >= 12 ? "PM" : "AM";
  const hh = String(raw % 12 || 12).padStart(2, "0");
  return `${hh}:${mm}:${ss} ${ampm}`;
}

type RituIconProps = { ritu: string };
function RituIcon({ ritu }: RituIconProps) {
  if (ritu === "Grīṣma") return <EmojiSunglassesFill className="bi-icon" />;
  const faIcon =
    ritu === "Vasanta"
      ? faSeedling
      : ritu === "Varṣā"
        ? faCloudBolt
        : ritu === "Śarada"
          ? faLeaf
          : ritu === "Hemanta"
            ? faWind
            : faSnowflake;
  return <FontAwesomeIcon icon={faIcon} />;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const RASHI: Record<string, { icon: IconDefinition; zodiacName: string }> = {
  Meṣa: { icon: faAries, zodiacName: "Aries" },
  Vṛṣabha: { icon: faTaurus, zodiacName: "Taurus" },
  Mithuna: { icon: faGemini, zodiacName: "Gemini" },
  Karka: { icon: faCancer, zodiacName: "Cancer" },
  Siṃha: { icon: faLeo, zodiacName: "Leo" },
  Kanyā: { icon: faVirgo, zodiacName: "Virgo" },
  Tulā: { icon: faLibra, zodiacName: "Libra" },
  Vṛścika: { icon: faScorpio, zodiacName: "Scorpio" },
  Dhanu: { icon: faSagittarius, zodiacName: "Sagittarius" },
  Makara: { icon: faCapricorn, zodiacName: "Capricorn" },
  Kumbha: { icon: faAquarius, zodiacName: "Aquarius" },
  Mīna: { icon: faPisces, zodiacName: "Pisces" },
};

interface StoredStarBirthday {
  name?: string;
  birthNakshatra: string;
  starBirthday: string;
  birthDateTime: string;
  birthLocation: LocationData;
}

function getStoredStarBirthdayData(): StoredStarBirthday | null {
  try {
    const stored = localStorage.getItem(STAR_BIRTHDAY_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as StoredStarBirthday;
  } catch {
    return null;
  }
}

function FindStarBirthdayPanel() {
  const stored = getStoredStarBirthdayData();
  const [name, setName] = useState(stored?.name ?? "");
  const [birthDateTime, setBirthDateTime] = useState(stored?.birthDateTime ?? "");
  const [birthLocation, setBirthLocation] = useState<LocationData | null>(
    stored?.birthLocation ?? null,
  );
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(getLocation);
  const [result, setResult] = useState<StarBirthdayResult | null>(
    stored?.birthNakshatra
      ? { birthNakshatra: stored.birthNakshatra, starBirthday: new Date(stored.starBirthday) }
      : null,
  );
  const dateTimeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const current = getStoredStarBirthdayData();
    localStorage.setItem(
      STAR_BIRTHDAY_KEY,
      JSON.stringify({ ...current, name, birthDateTime, birthLocation }),
    );
  }, [name, birthDateTime, birthLocation]);

  function openDatePicker() {
    try {
      dateTimeInputRef.current?.showPicker();
    } catch {
      // showPicker unsupported — native click on input will handle it
    }
  }

  function handleFind() {
    if (!birthLocation || !currentLocation) return;
    const res = computeStarBirthday(
      new Date(),
      birthDateTime,
      birthLocation.latitude,
      birthLocation.longitude,
      currentLocation.latitude,
      currentLocation.longitude,
    );
    setResult(res);
  }

  const allFilled =
    name !== "" && birthDateTime !== "" && birthLocation !== null && currentLocation !== null;

  return (
    <section className="star-birthday-panel">
      <h2 className="star-birthday-panel__title">Find My Star Birthday</h2>
      <div className="star-birthday-form">
        <div className="star-birthday-form__field">
          <label className="star-birthday-form__label">Name</label>
          <input
            type="text"
            className="star-birthday-form__text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="star-birthday-form__field">
          <label className="star-birthday-form__label">Birth Date &amp; Time</label>
          <div className="star-birthday-form__datetime-wrapper">
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="star-birthday-form__datetime-icon"
              onClick={openDatePicker}
            />
            <input
              ref={dateTimeInputRef}
              type="datetime-local"
              className="star-birthday-form__datetime"
              value={birthDateTime}
              onChange={(e) => setBirthDateTime(e.target.value)}
            />
          </div>
        </div>
        <div className="star-birthday-form__field">
          <label className="star-birthday-form__label">Birth City</label>
          <CitySearch
            saveToStorage={false}
            onLocationSelect={setBirthLocation}
            initialValue={
              stored?.birthLocation
                ? `${stored.birthLocation.city}, ${stored.birthLocation.country}`
                : undefined
            }
          />
        </div>
        <div className="star-birthday-form__field">
          <label className="star-birthday-form__label">Current City</label>
          <CitySearch onLocationSelect={setCurrentLocation} />
        </div>
        <button className="star-birthday-form__btn" disabled={!allFilled} onClick={handleFind}>
          <FontAwesomeIcon icon={faStar} /> Find Star Birthday
        </button>
        {result && (
          <div className="star-birthday-result">
            <div className="star-birthday-result__section">
              <span className="anga-card__label">
                <FontAwesomeIcon icon={faStar} />
                BIRTH STAR
              </span>
              <span className="anga-card__value">{result.birthNakshatra}</span>
            </div>
            <div className="star-birthday-result__section">
              <span className="anga-card__label">
                <FontAwesomeIcon icon={faCalendarDays} />
                STAR BIRTHDAY
              </span>
              <span className="anga-card__value">
                {result.starBirthday.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="anga-card__sub">
                {result.starBirthday.toLocaleDateString("en-IN", { weekday: "long" })}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function DailyView({ timeFormat, lunarSystem }: DailyViewProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const location = getLocation();
  // Recompute panchangam at most once per minute — astronomical values don't change per-second
  const minuteKey = Math.floor(now.getTime() / 60000);
  const p = useMemo(
    () => computePanchangam(now, location?.latitude, location?.longitude, lunarSystem),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [minuteKey, location?.latitude, location?.longitude, lunarSystem],
  );

  return (
    <main className="daily-view">
      <section className="panchang-panel">
        <div className="anga-grid">
          <div className="anga-top-row">
            <div className="anga-card anga-card--time">
              <span className="anga-card__label">
                <FontAwesomeIcon icon={faClock} />
                TIME
              </span>
              <span className="anga-card__value">{formatTime(now, timeFormat)}</span>
              <span className="anga-card__sub">{formatDate(now)}</span>
            </div>
            <div className="anga-card anga-card--tithi">
              <div className="tithi-card__inner">
                <div className="tithi-card__lunar-phase">
                  <img
                    src={getMoonPhaseImage(p.tithi.number, p.tithi.paksha)}
                    alt={`${p.tithi.paksha} ${p.tithi.number}`}
                    className="tithi-card__moon-image"
                  />
                </div>
                <div className="tithi-card__info">
                  <span className="anga-card__label">TITHI</span>
                  <span className="anga-card__value">{p.tithi.name}</span>
                  <span className="anga-card__sub">
                    {p.tithi.paksha} Paksha · {p.tithi.number}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="anga-card anga-card--full-row">
            <div className="time-card__header">
              <div className="time-card__section">
                <span className="anga-card__label">
                  <SunriseFill className="bi-icon" />
                  SUNRISE
                </span>
                <span className="anga-card__value">
                  {p.sunRise ? formatTime(p.sunRise, timeFormat) : "Set your city"}
                </span>
              </div>
              <div className="time-card__section">
                <span className="anga-card__label">
                  <SunsetFill className="bi-icon" />
                  SUNSET
                </span>
                <span className="anga-card__value">
                  {p.sunSet ? formatTime(p.sunSet, timeFormat) : "Set your city"}
                </span>
              </div>
            </div>
          </div>
          <div className="anga-top-row">
            <div className="anga-card anga-card--half">
              <span className="anga-card__label">
                <FontAwesomeIcon icon={faStar} />
                NAKSHATRA
              </span>
              {p.nakshatras.map((n, i) => (
                <div key={i} className="anga-entry">
                  <span className="anga-card__value">{n.name}</span>
                  {n.endTime && (
                    <span className="anga-card__sub">upto {formatTime(n.endTime, timeFormat)}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="anga-card anga-card--half">
              <span className="anga-card__label">
                <FontAwesomeIcon icon={faInfinity} />
                YOGA
              </span>
              {p.yogas.map((y, i) => (
                <div key={i} className="anga-entry">
                  <span className="anga-card__value">{y.name}</span>
                  {y.endTime && (
                    <span className="anga-card__sub">upto {formatTime(y.endTime, timeFormat)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="anga-top-row">
            <div className="anga-card anga-card--half">
              <span className="anga-card__label">
                <FontAwesomeIcon icon={faScaleBalanced} />
                KARANA
              </span>
              {p.karanas.map((k, i) => (
                <div key={i} className="anga-entry">
                  <span className="anga-card__value">{k.name}</span>
                  {k.endTime && (
                    <span className="anga-card__sub">upto {formatTime(k.endTime, timeFormat)}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="anga-card anga-card--half">
              <span className="anga-card__label">
                <RituIcon ritu={p.ritu} />
                RITU
              </span>
              <span className="anga-card__value">{p.ritu}</span>
            </div>
          </div>
          <div className="anga-card anga-card--full-row anga-card--centered">
            <span className="anga-card__label">
              <FontAwesomeIcon icon={faCalendarDays} />
              VARA - MASA - SAMVATSARA
            </span>
            <span className="anga-card__value">
              {p.vara} - {p.masa} - {p.samvatsare}
            </span>
          </div>
          <div className="anga-card anga-card--full-row">
            <div className="rashi-card__header">
              <div className="rashi-card__section">
                <span className="anga-card__label">
                  <FontAwesomeIcon icon={faSun} />
                  SUN RASHI
                </span>
                <span className="anga-card__value">
                  <FontAwesomeIcon icon={RASHI[p.sunRashi].icon} /> {p.sunRashi}
                </span>
                <span className="anga-card__sub">{RASHI[p.sunRashi].zodiacName}</span>
              </div>
              <div className="rashi-card__section">
                <span className="anga-card__label">
                  <FontAwesomeIcon icon={faMoon} />
                  MOON RASHI
                </span>
                <span className="anga-card__value">
                  <FontAwesomeIcon icon={RASHI[p.moonRashi].icon} /> {p.moonRashi}
                </span>
                <span className="anga-card__sub">{RASHI[p.moonRashi].zodiacName}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FindStarBirthdayPanel />
    </main>
  );
}
