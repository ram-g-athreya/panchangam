import { computePanchangam } from "../core/panchangam";
import type { LocationData } from "../constants";
import { LOCATION_KEY } from "../constants";
import "../styles/Sankalpam.css";

function getLocation(): { latitude: number; longitude: number } | null {
  const stored = localStorage.getItem(LOCATION_KEY);
  if (stored) {
    const data = JSON.parse(stored) as LocationData;
    return { latitude: data.latitude, longitude: data.longitude };
  }
  return null;
}

export function Sankalpam() {
  const location = getLocation();
  const p = computePanchangam(new Date(), location?.latitude, location?.longitude);
  const v = (s: string) => <strong>{s}</strong>;

  return (
    <main className="sankalpam">
      <h1 className="sankalpam__title">Sankalpam</h1>
      <p className="sankalpam__text">
        {v(p.samvatsare)} Namasamvatsare, {v(p.ayane)}, {v(p.ritau)} Ritau, {v(p.mase)} Mase,{" "}
        {v(p.tithi.paksha)} Pakshe, {v(p.tithi.name)} Tithau, {v(p.vara)} Vasare, {v(p.nakshatra)}{" "}
        Nakshatre, {v(p.yoga)} Yoge, {v(p.karana)} Karane
      </p>
    </main>
  );
}
