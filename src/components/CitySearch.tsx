import { useState } from "react";
import { library, findIconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LOCATION_KEY } from "../constants";
import "../styles/CitySearch.css";

library.add(faLocationDot);

const locationIcon = findIconDefinition({ prefix: "fas", iconName: "location-dot" });

function getStoredCity(): string {
  try {
    const stored = localStorage.getItem(LOCATION_KEY);
    if (!stored) return "";
    return (JSON.parse(stored) as { city?: string }).city ?? "";
  } catch {
    return "";
  }
}

export function CitySearch() {
  const [city, setCity] = useState<string>(getStoredCity);

  async function handleBlur() {
    const trimmed = city.trim();
    if (!trimmed) return;
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=1&language=en&format=json`,
      );
      const data = (await res.json()) as {
        results?: { name: string; latitude: number; longitude: number }[];
      };
      const result = data.results?.[0];
      if (result) {
        localStorage.setItem(
          LOCATION_KEY,
          JSON.stringify({
            city: result.name,
            latitude: result.latitude,
            longitude: result.longitude,
          }),
        );
        setCity(result.name);
      }
    } catch {
      // keep user's typed value if geocoding fails
    }
  }

  return (
    <div className="city-search">
      <FontAwesomeIcon icon={locationIcon} className="city-search__icon" />
      <input
        className="city-search__input"
        type="text"
        placeholder="Enter City Name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onBlur={handleBlur}
      />
    </div>
  );
}
