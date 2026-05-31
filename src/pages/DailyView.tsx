import React, { useState, useEffect, useMemo, useRef } from "react";
import { CitySearch } from "../components/CitySearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faStar,
  faInfinity,
  faScaleBalanced,
  faCalendarDays,
  faCalendarPlus,
  faCakeCandles,
  faChevronDown,
  faDownload,
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
import { Moon, LunarPhase } from "lunarphase-js";
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

const moonEmojiBySystem: Record<LunarSystem, string> = {
  amanta: Moon.emojiForLunarPhase(LunarPhase.NEW),
  purnimanta: Moon.emojiForLunarPhase(LunarPhase.FULL),
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

function formatTime(date: Date, format: TimeFormat, displaySecond = true): string {
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  if (format === "24h") {
    const hh = String(date.getHours()).padStart(2, "0");
    return `${hh}:${mm}` + (displaySecond ? `:${ss}` : "");
  }
  const raw = date.getHours();
  const ampm = raw >= 12 ? "PM" : "AM";
  const hh = String(raw % 12 || 12).padStart(2, "0");
  return `${hh}:${mm}` + (displaySecond ? `:${ss}` : "") + ` ${ampm}`;
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

function formatTimeRange(
  range: { start: Date; end: Date } | undefined,
  format: TimeFormat,
  displaySecond = true,
): string {
  if (!range) return "Set your city";
  return `${formatTime(range.start, format, displaySecond)} to ${formatTime(range.end, format, displaySecond)}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function toICSDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function toISO8601Date(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function nextDay(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d;
}

function buildGoogleCalendarUrl(title: string, date: Date): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toICSDateString(date)}/${toICSDateString(nextDay(date))}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildOutlookUrl(title: string, date: Date): string {
  const params = new URLSearchParams({
    subject: title,
    startdt: toISO8601Date(date),
    enddt: toISO8601Date(date),
    allday: "true",
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function downloadICS(title: string, date: Date): void {
  const start = toICSDateString(date);
  const end = toICSDateString(nextDay(date));
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Panchangam//EN",
    "BEGIN:VEVENT",
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${title}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.ics`;
  a.click();
  URL.revokeObjectURL(url);
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

interface StoredProfile {
  name: string;
  birthDateTime: string;
  birthLocation: LocationData;
}

function getStoredProfiles(): StoredProfile[] {
  try {
    const stored = localStorage.getItem(STAR_BIRTHDAY_KEY);
    if (!stored) return [];
    const data = JSON.parse(stored);
    return Array.isArray(data) ? (data as StoredProfile[]) : [];
  } catch {
    return [];
  }
}

function saveProfiles(profiles: StoredProfile[]): void {
  localStorage.setItem(STAR_BIRTHDAY_KEY, JSON.stringify(profiles));
}

interface SidePanelProps {
  lunarSystem: LunarSystem;
}

function SidePanel({ lunarSystem }: SidePanelProps) {
  const [profiles, setProfiles] = useState<StoredProfile[]>(getStoredProfiles);
  const [name, setName] = useState<string>(() => getStoredProfiles()[0]?.name ?? "");
  const [birthDateTime, setBirthDateTime] = useState<string>(
    () => getStoredProfiles()[0]?.birthDateTime ?? "",
  );
  const [birthLocation, setBirthLocation] = useState<LocationData | null>(
    () => getStoredProfiles()[0]?.birthLocation ?? null,
  );
  const [birthCityKey, setBirthCityKey] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(getLocation);
  const [formLunarSystem, setFormLunarSystem] = useState<LunarSystem>(lunarSystem);
  const [result, setResult] = useState<StarBirthdayResult | null>(null);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  const dateTimeInputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const didAutoSubmit = useRef(false);

  // Auto-submit on mount if the most recent profile and current location are available
  useEffect(() => {
    const firstProfile = getStoredProfiles()[0];
    const cLoc = getLocation();
    if (!didAutoSubmit.current && firstProfile && cLoc) {
      didAutoSubmit.current = true;
      setResult(
        computeStarBirthday(
          new Date(),
          firstProfile.birthDateTime,
          firstProfile.birthLocation.latitude,
          firstProfile.birthLocation.longitude,
          cLoc.latitude,
          cLoc.longitude,
          lunarSystem,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showCalendarOptions) return;
    function handleClickOutside(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendarOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendarOptions]);

  function compute(
    n: string,
    bdt: string,
    bLoc: LocationData,
    cLoc: LocationData,
    ls: LunarSystem = formLunarSystem,
  ) {
    const res = computeStarBirthday(
      new Date(),
      bdt,
      bLoc.latitude,
      bLoc.longitude,
      cLoc.latitude,
      cLoc.longitude,
      ls,
    );
    setResult(res);
    setShowCalendarOptions(false);
    const newProfile: StoredProfile = { name: n, birthDateTime: bdt, birthLocation: bLoc };
    const updated = [newProfile, ...profiles.filter((p) => p.name !== n)].slice(0, 5);
    setProfiles(updated);
    saveProfiles(updated);
  }

  function loadProfile(profile: StoredProfile) {
    setName(profile.name);
    setBirthDateTime(profile.birthDateTime);
    setBirthLocation(profile.birthLocation);
    setBirthCityKey((k) => k + 1);
    if (currentLocation) {
      compute(profile.name, profile.birthDateTime, profile.birthLocation, currentLocation);
    }
  }

  function removeProfile(profileName: string) {
    const updated = profiles.filter((p) => p.name !== profileName);
    setProfiles(updated);
    saveProfiles(updated);
  }

  function openDatePicker() {
    try {
      dateTimeInputRef.current?.showPicker();
    } catch {
      // showPicker unsupported — native click on input will handle it
    }
  }

  function handleFind() {
    if (!birthLocation || !currentLocation || !name || !birthDateTime) return;
    compute(name, birthDateTime, birthLocation, currentLocation);
  }

  const allFilled =
    name !== "" && birthDateTime !== "" && birthLocation !== null && currentLocation !== null;

  const eventTitle = `${name}'s Nakshatra Birthday`;

  return (
    <section className="star-birthday-panel">
      <div className="find-birthday-section">
        <h2 className="find-birthday-section__title">Find My Star Birthday</h2>
        {profiles.length > 0 && (
          <div className="star-birthday-pills">
            {profiles.map((profile) => (
              <div key={profile.name} className="star-birthday-pill">
                <button className="star-birthday-pill__name" onClick={() => loadProfile(profile)}>
                  {profile.name}
                </button>
                <button
                  className="star-birthday-pill__remove"
                  onClick={() => removeProfile(profile.name)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
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
              key={birthCityKey}
              saveToStorage={false}
              onLocationSelect={setBirthLocation}
              initialValue={
                birthLocation ? `${birthLocation.city}, ${birthLocation.country}` : undefined
              }
            />
          </div>
          <div className="star-birthday-form__field">
            <label className="star-birthday-form__label">Current City</label>
            <CitySearch onLocationSelect={setCurrentLocation} />
          </div>
          <div className="star-birthday-form__field">
            <label className="star-birthday-form__label">Lunar System</label>
            <button
              className={`lunar-system-toggle lunar-system-toggle--${formLunarSystem}`}
              onClick={() => {
                const newLs: LunarSystem = formLunarSystem === "amanta" ? "purnimanta" : "amanta";
                setFormLunarSystem(newLs);
                if (allFilled) {
                  compute(name, birthDateTime, birthLocation!, currentLocation!, newLs);
                }
              }}
              aria-label="Toggle lunar system"
            >
              <span className="lunar-system-toggle__thumb">
                {moonEmojiBySystem[formLunarSystem]}
              </span>
              <span className="lunar-system-toggle__label">
                {formLunarSystem === "amanta" ? "Amānta" : "Pūrṇimānta"}
              </span>
            </button>
          </div>
          <button className="star-birthday-form__btn" disabled={!allFilled} onClick={handleFind}>
            <FontAwesomeIcon icon={faStar} /> Find Star Birthday
          </button>
          {result && (
            <>
              <div className="star-birthday-result">
                <div className="star-birthday-result__row">
                  <div className="star-birthday-result__section">
                    <span className="anga-card__label">
                      <FontAwesomeIcon icon={faStar} />
                      NAKSHATRA
                    </span>
                    <span className="anga-card__value">{result.birthNakshatra}</span>
                  </div>
                  <div className="star-birthday-result__section">
                    <span className="anga-card__label">
                      <FontAwesomeIcon icon={faCakeCandles} />
                      BIRTHDAY
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
                <div className="star-birthday-result__row star-birthday-result__row--divider">
                  <div className="star-birthday-result__section">
                    <span className="anga-card__label">
                      <FontAwesomeIcon icon={faCalendarDays} />
                      MASA
                    </span>
                    <span className="anga-card__value">{result.birthMasa}</span>
                  </div>
                  <div className="star-birthday-result__section">
                    <span className="anga-card__label">
                      <FontAwesomeIcon icon={faMoon} />
                      RASHI
                    </span>
                    <span className="anga-card__value">
                      <FontAwesomeIcon icon={RASHI[result.birthRashi].icon} /> {result.birthRashi}
                    </span>
                    <span className="anga-card__sub">{RASHI[result.birthRashi].zodiacName}</span>
                  </div>
                </div>
              </div>
              <div className="add-to-calendar" ref={calendarRef}>
                <div className="add-to-calendar__split-btn">
                  <a
                    href={buildGoogleCalendarUrl(eventTitle, result.starBirthday)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="add-to-calendar__primary"
                  >
                    <FontAwesomeIcon icon={faCalendarPlus} /> Add to Google Calendar
                  </a>
                  <button
                    className="add-to-calendar__chevron"
                    onClick={() => setShowCalendarOptions((o) => !o)}
                    aria-label="More calendar options"
                  >
                    <FontAwesomeIcon icon={faChevronDown} />
                  </button>
                </div>
                {showCalendarOptions && (
                  <div className="add-to-calendar__dropdown">
                    <a
                      href={buildGoogleCalendarUrl(eventTitle, result.starBirthday)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="add-to-calendar__option"
                      onClick={() => setShowCalendarOptions(false)}
                    >
                      <FontAwesomeIcon icon={faCalendarDays} /> Add to Google Calendar
                    </a>
                    <a
                      href={buildOutlookUrl(eventTitle, result.starBirthday)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="add-to-calendar__option"
                      onClick={() => setShowCalendarOptions(false)}
                    >
                      <FontAwesomeIcon icon={faCalendarDays} /> Add to Outlook
                    </a>
                    <button
                      className="add-to-calendar__option"
                      onClick={() => {
                        downloadICS(eventTitle, result.starBirthday);
                        setShowCalendarOptions(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faDownload} /> Download .ics
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
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

  const v = (s: string): React.ReactNode => <strong>{s}</strong>;

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
                <div
                  key={i}
                  className={`anga-entry${n.endTime && now > n.endTime ? " anga-entry--expired" : ""}`}
                >
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
                <div
                  key={i}
                  className={`anga-entry${y.endTime && now > y.endTime ? " anga-entry--expired" : ""}`}
                >
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
                <div
                  key={i}
                  className={`anga-entry${k.endTime && now > k.endTime ? " anga-entry--expired" : ""}`}
                >
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
          <div className="anga-card anga-card--full-row">
            <div className="rashi-card__header kalam-card__header">
              <div className="rashi-card__section">
                <span className="anga-card__label">
                  <span className="kalam-icon kalam-icon--snake" aria-hidden="true" />
                  RAHU KALAM
                </span>
                <span className="anga-card__value">
                  {formatTimeRange(p.rahuKalam, timeFormat, false)}
                </span>
              </div>
              <div className="rashi-card__section">
                <span className="anga-card__label">
                  <span className="kalam-icon kalam-icon--bull" aria-hidden="true" />
                  YAMA GANDAM
                </span>
                <span className="anga-card__value">
                  {formatTimeRange(p.yamaKandam, timeFormat, false)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="sankalpam-section">
          <h1 className="sankalpam-section__title">Sankalpam</h1>
          <p className="sankalpam-section__text">
            {v(p.samvatsare)} Namasamvatsare, {v(p.ayana)}, {v(p.ritu)} Ritau, {v(p.masa)} Mase,{" "}
            {v(p.tithi.paksha)} Pakshe, {v(p.tithi.name)} Tithau, {v(p.vara)} Vasare,{" "}
            {v(p.nakshatras[0].name)} Nakshatre, {v(p.yogas[0].name)} Yoge, {v(p.karanas[0].name)}{" "}
            Karane
          </p>
        </div>
      </section>
      <SidePanel lunarSystem={lunarSystem} />
    </main>
  );
}
