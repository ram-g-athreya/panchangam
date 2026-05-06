export type Theme = "light" | "dark";
export const THEME_KEY = "theme";

export type TimeFormat = "12h" | "24h";
export const TIME_FORMAT_KEY = "timeFormat";

export interface LocationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}
export const LOCATION_KEY = "location";
