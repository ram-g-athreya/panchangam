import { useState, useEffect, useMemo } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import { SunriseFill, SunsetFill, EmojiSunglassesFill } from "react-bootstrap-icons";
import { Moon } from "lunarphase-js";
import { computePanchangam } from "../core/panchangam";
import type { TimeFormat, LocationData, LunarSystem } from "../constants";
import { LOCATION_KEY } from "../constants";
import "../styles/DailyView.css";

function getLocation(): { latitude: number; longitude: number } | null {
  const stored = localStorage.getItem(LOCATION_KEY);
  if (stored) {
    const data = JSON.parse(stored) as LocationData;
    return { latitude: data.latitude, longitude: data.longitude };
  }
  return null;
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

interface DailyViewProps {
  timeFormat: TimeFormat;
  lunarSystem: LunarSystem;
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
                <div className="tithi-card__lunar-phase">{Moon.lunarPhaseEmoji(now)}</div>
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
                <RituIcon ritu={p.ritau} />
                RITU
              </span>
              <span className="anga-card__value">{p.ritau}</span>
            </div>
          </div>
          <div className="anga-card anga-card--full-row anga-card--centered">
            <span className="anga-card__label">
              <FontAwesomeIcon icon={faCalendarDays} />
              VARA - MASA - SAMVATSARA
            </span>
            <span className="anga-card__value">
              {p.vara} - {p.mase} - {p.samvatsare}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
