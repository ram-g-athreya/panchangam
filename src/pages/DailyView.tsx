import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faMoon,
  faSun,
  faStar,
  faInfinity,
  faScaleBalanced,
} from "@fortawesome/free-solid-svg-icons";
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
  const p = computePanchangam(now, location?.latitude, location?.longitude);

  return (
    <main className="daily-view">
      <div className="anga-grid">
        <div className="anga-card">
          <div className="anga-card__label">
            <FontAwesomeIcon icon={faClock} />
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
          <span className="anga-card__value">{formatTime(now, timeFormat)}</span>
          <span className="anga-card__sub">{formatDate(now)}</span>
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
          <span className="anga-card__value">{p.nakshatra}</span>
        </div>
        <div className="anga-card">
          <span className="anga-card__label">
            <FontAwesomeIcon icon={faInfinity} />
            YOGA
          </span>
          <span className="anga-card__value">{p.yoga}</span>
        </div>
        <div className="anga-card">
          <span className="anga-card__label">
            <FontAwesomeIcon icon={faScaleBalanced} />
            KARANA
          </span>
          <span className="anga-card__value">{p.karana}</span>
        </div>
      </div>
    </main>
  );
}
