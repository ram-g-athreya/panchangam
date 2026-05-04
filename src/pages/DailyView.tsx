import { computePanchangam } from "../core/panchangam";
import "../styles/DailyView.css";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function DailyView() {
  const today = new Date();
  const p = computePanchangam(today);

  return (
    <main className="daily-view">
      <p className="daily-view__date">{formatDate(today)}</p>
      <div className="anga-grid">
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
