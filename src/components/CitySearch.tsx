import { useState, useRef, useEffect } from "react";
import { library, findIconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LOCATION_KEY } from "../constants";
import "../styles/CitySearch.css";

library.add(faLocationDot);

const locationIcon = findIconDefinition({ prefix: "fas", iconName: "location-dot" });

interface PhotonProperties {
  name: string;
  city?: string;
  state?: string;
  country?: string;
}

interface PhotonFeature {
  geometry: { coordinates: [number, number] };
  properties: PhotonProperties;
}

interface PhotonResponse {
  features: PhotonFeature[];
}

function getStoredCity(): string {
  try {
    const stored = localStorage.getItem(LOCATION_KEY);
    if (!stored) return "";
    return (JSON.parse(stored) as { city?: string }).city ?? "";
  } catch {
    return "";
  }
}

function formatSuggestion(props: PhotonProperties): string {
  return [props.name, props.state, props.country].filter(Boolean).join(", ");
}

export function CitySearch() {
  const [inputValue, setInputValue] = useState<string>(getStoredCity);
  const [suggestions, setSuggestions] = useState<PhotonFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const selectedRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleFocus() {
    setInputValue("");
    setSuggestions([]);
    setShowSuggestions(false);
    selectedRef.current = false;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);
    selectedRef.current = false;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length > 2) {
      debounceRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const res = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(value.trim())}&osm_tag=place:city&osm_tag=place:town&osm_tag=place:village&limit=7`,
          );
          const data = (await res.json()) as PhotonResponse;
          setSuggestions(data.features ?? []);
          setShowSuggestions(true);
        } catch {
          // ignore network errors
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }
  }

  function handleSelect(feature: PhotonFeature) {
    const cityName = feature.properties.name;
    selectedRef.current = true;
    setInputValue(cityName);
    setSuggestions([]);
    setShowSuggestions(false);
    localStorage.setItem(
      LOCATION_KEY,
      JSON.stringify({
        city: cityName,
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
      }),
    );
  }

  function handleBlur() {
    setTimeout(() => {
      if (!selectedRef.current) {
        setInputValue(getStoredCity());
      }
      setShowSuggestions(false);
      setIsLoading(false);
    }, 150);
  }

  return (
    <div className="city-search">
      <FontAwesomeIcon icon={locationIcon} className="city-search__icon" />
      <div className="city-search__wrapper">
        <input
          className="city-search__input"
          type="text"
          placeholder="Enter City Name"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {isLoading && <span className="city-search__spinner" aria-hidden="true" />}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="city-search__suggestions">
          {suggestions.map((s, i) => (
            <li key={i} className="city-search__suggestion" onMouseDown={() => handleSelect(s)}>
              {formatSuggestion(s.properties)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
