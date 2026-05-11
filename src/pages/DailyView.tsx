import { useState, useEffect, useMemo, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faMoon,
  faSun,
  faStar,
  faInfinity,
  faScaleBalanced,
  faCalendarDays,
  faSeedling,
  faCloudBolt,
  faLeaf,
  faWind,
  faSnowflake,
} from "@fortawesome/free-solid-svg-icons";
import { SunriseFill, SunsetFill, EmojiSunglassesFill } from "react-bootstrap-icons";
import { computePanchangam } from "../core/panchangam";
import type { TimeFormat, LocationData } from "../constants";
import { TIME_FORMAT_KEY, LOCATION_KEY } from "../constants";
import "../styles/DailyView.css";

function getLocation(): { latitude: number; longitude: number } | null {
  const stored = localStorage.getItem(LOCATION_KEY);
  if (stored) {
    const data = JSON.parse(stored) as LocationData;
    return { latitude: data.latitude, longitude: data.longitude };
  }
  return null;
}

function getInitialTimeFormat(): TimeFormat {
  const stored = localStorage.getItem(TIME_FORMAT_KEY);
  return stored === "24h" ? "24h" : "12h";
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
  if (ritu === "Grishma") return <EmojiSunglassesFill className="bi-icon" />;
  const faIcon =
    ritu === "Vasanta"
      ? faSeedling
      : ritu === "Varsha"
        ? faCloudBolt
        : ritu === "Sharada"
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

export function DailyView() {
  const [now, setNow] = useState(new Date());
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(getInitialTimeFormat);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  function toggleTimeFormat() {
    setTimeFormat((f) => {
      const next = f === "12h" ? "24h" : "12h";
      localStorage.setItem(TIME_FORMAT_KEY, next);
      return next;
    });
  }

  const location = getLocation();
  // Recompute panchangam at most once per minute — astronomical values don't change per-second
  const minuteKey = Math.floor(now.getTime() / 60000);
  const p = useMemo(
    () => computePanchangam(now, location?.latitude, location?.longitude),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [minuteKey, location?.latitude, location?.longitude],
  );

  return (
    <main className="daily-view">
      <section className="panchang-panel">
        <div className="panchang-panel__header">
          <h2 className="panchang-panel__title">Panchangam for Today</h2>
          <button
            className={`time-format-toggle time-format-toggle--${timeFormat}`}
            onClick={toggleTimeFormat}
            aria-label="Toggle time format"
          >
            <span className="time-format-toggle__thumb" />
            <span className="time-format-toggle__label">
              {timeFormat === "12h" ? "12-hour" : "24-hour"}
            </span>
          </button>
        </div>
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
            <div className="anga-card anga-card--calendar">
              <span className="anga-card__label">
                <FontAwesomeIcon icon={faCalendarDays} />
                MASA - SAMVATSARA
              </span>
              <span className="anga-card__value">
                {p.mase} - {p.samvatsare}
              </span>
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
          <div className="anga-card">
            <span className="anga-card__label">
              <FontAwesomeIcon icon={faMoon} />
              TITHI
            </span>
            <span className="anga-card__value">{p.tithi.name}</span>
            <span className="anga-card__sub">
              {p.tithi.paksha} Paksha · {p.tithi.number}
            </span>
          </div>
          <div className="anga-card">
            <span className="anga-card__label">
              <FontAwesomeIcon icon={faSun} />
              VARA
            </span>
            <span className="anga-card__value">{p.vara}</span>
          </div>
          <div className="anga-card">
            <span className="anga-card__label">
              <FontAwesomeIcon icon={faStar} />
              NAKSHATRA
            </span>
            {p.nakshatras.map((n, i) => (
              <Fragment key={i}>
                <span className="anga-card__value">{n.name}</span>
                {n.endTime && (
                  <span className="anga-card__sub">upto {formatTime(n.endTime, timeFormat)}</span>
                )}
              </Fragment>
            ))}
          </div>
          <div className="anga-card">
            <span className="anga-card__label">
              <FontAwesomeIcon icon={faInfinity} />
              YOGA
            </span>
            {p.yogas.map((y, i) => (
              <Fragment key={i}>
                <span className="anga-card__value">{y.name}</span>
                {y.endTime && (
                  <span className="anga-card__sub">upto {formatTime(y.endTime, timeFormat)}</span>
                )}
              </Fragment>
            ))}
          </div>
          <div className="anga-card">
            <span className="anga-card__label">
              <FontAwesomeIcon icon={faScaleBalanced} />
              KARANA
            </span>
            {p.karanas.map((k, i) => (
              <Fragment key={i}>
                <span className="anga-card__value">{k.name}</span>
                {k.endTime && (
                  <span className="anga-card__sub">upto {formatTime(k.endTime, timeFormat)}</span>
                )}
              </Fragment>
            ))}
          </div>
          <div className="anga-card">
            <span className="anga-card__label">
              <RituIcon ritu={p.ritau} />
              RITU
            </span>
            <span className="anga-card__value">{p.ritau}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
