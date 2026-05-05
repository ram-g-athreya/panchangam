import { computePanchangam } from "../core/panchangam";
import "../styles/Sankalpam.css";

export function Sankalpam() {
  const p = computePanchangam(new Date());
  const v = (s: string) => <strong>{s}</strong>;

  return (
    <main className="sankalpam">
      <h1 className="sankalpam__title">Sankalpam</h1>
      <p className="sankalpam__text">
        {v(p.namasamvatsare)} Namasamvatsare, {v(p.ayane)}, {v(p.ritau)} Ritau,{" "}
        {v(p.mase)} Mase, {v(p.tithi.paksha)} Pakshe, {v(p.tithi.name)} Tithau,{" "}
        {v(p.vara)} Vasare, {v(p.nakshatra)} Nakshatre, {v(p.yoga)} Yoge,{" "}
        {v(p.karana)} Karane
      </p>
    </main>
  );
}
