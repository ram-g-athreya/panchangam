import { computePanchangam } from "../core/panchangam";
import type { LocationData, LunarSystem } from "../constants";
import { LOCATION_KEY, LUNAR_SYSTEM_KEY } from "../constants";
import "../styles/Sankalpam.css";

function getLocation(): { latitude: number; longitude: number } | null {
  const stored = localStorage.getItem(LOCATION_KEY);
  if (stored) {
    const data = JSON.parse(stored) as LocationData;
    return { latitude: data.latitude, longitude: data.longitude };
  }
  return null;
}

function getLunarSystem(): LunarSystem {
  return localStorage.getItem(LUNAR_SYSTEM_KEY) === "purnimanta" ? "purnimanta" : "amanta";
}

export function Sankalpam() {
  const location = getLocation();
  const p = computePanchangam(
    new Date(),
    location?.latitude,
    location?.longitude,
    getLunarSystem(),
    false,
  );
  const v = (s: string) => <strong>{s}</strong>;

  return (
    <main className="sankalpam">
      <h1 className="sankalpam__title">Sankalpam</h1>
      <p className="sankalpam__text">
        {v(p.samvatsare)} Namasamvatsare, {v(p.ayana)}, {v(p.ritu)} Ritau, {v(p.masa)} Mase,{" "}
        {v(p.tithi.paksha)} Pakshe, {v(p.tithi.name)} Tithau, {v(p.vara)}, {v(p.nakshatras[0].name)}{" "}
        Nakshatre, {v(p.yogas[0].name)} Yoge, {v(p.karanas[0].name)} Karane
      </p>
    </main>
  );
}
