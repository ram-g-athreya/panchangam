import { useState, useRef, useEffect } from "react";
import { library, findIconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { LocationData } from "../constants";
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

function getStoredDisplay(): string {
  try {
    const stored = localStorage.getItem(LOCATION_KEY);
    if (!stored) return "";
    const { city, country } = JSON.parse(stored) as { city?: string; country?: string };
    if (!city) return "";
    return country ? `${city}, ${country}` : city;
  } catch {
    return "";
  }
}

function formatSuggestion(props: PhotonProperties): string {
  return [props.name, props.state, props.country].filter(Boolean).join(", ");
}

interface CitySearchProps {
  saveToStorage?: boolean;
  onLocationSelect?: (data: LocationData) => void;
}

export function CitySearch({ saveToStorage = true, onLocationSelect }: CitySearchProps = {}) {
  const [inputValue, setInputValue] = useState<string>(() =>
    saveToStorage ? getStoredDisplay() : "",
  );
  const [suggestions, setSuggestions] = useState<PhotonFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const selectedRef = useRef(false);
  const displayValueRef = useRef<string>(saveToStorage ? getStoredDisplay() : "");
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
    const country = feature.properties.country ?? "";
    const displayStr = country ? `${cityName}, ${country}` : cityName;
    selectedRef.current = true;
    displayValueRef.current = displayStr;
    setInputValue(displayStr);
    setSuggestions([]);
    setShowSuggestions(false);
    const locationData: LocationData = {
      city: cityName,
      country,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
    };
    if (saveToStorage) {
      localStorage.setItem(LOCATION_KEY, JSON.stringify(locationData));
    }
    onLocationSelect?.(locationData);
  }

  function handleBlur() {
    setTimeout(() => {
      if (!selectedRef.current) {
        setInputValue(saveToStorage ? getStoredDisplay() : displayValueRef.current);
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
          placeholder="Enter city for accuracy"
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
