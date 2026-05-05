import { useState, useEffect } from "react";
import { computePanchangam } from "../core/panchangam";
import "../styles/DailyView.css";

function formatTime(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
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

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const p = computePanchangam(now);

  return (
    <main className="daily-view">
      <div className="anga-grid">
        <div className="anga-card">
          <span className="anga-card__label"></span>
          <span className="anga-card__value">{formatTime(now)}</span>
          <span className="anga-card__sub">{formatDate(now)}</span>
        </div>
        <div className="anga-card">
          <span className="anga-card__label">Tithi</span>
          <span className="anga-card__value">{p.tithi.name}</span>
          <span className="anga-card__sub">
            {p.tithi.paksha} Paksha · {p.tithi.number}
          </span>
        </div>
        <div className="anga-card">
          <span className="anga-card__label">Vara</span>
          <span className="anga-card__value">{p.vara}</span>
        </div>
        <div className="anga-card">
          <span className="anga-card__label">Nakshatra</span>
          <span className="anga-card__value">{p.nakshatra}</span>
        </div>
        <div className="anga-card">
          <span className="anga-card__label">Yoga</span>
          <span className="anga-card__value">{p.yoga}</span>
        </div>
        <div className="anga-card">
          <span className="anga-card__label">Karana</span>
          <span className="anga-card__value">{p.karana}</span>
        </div>
      </div>
    </main>
  );
}
