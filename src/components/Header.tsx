import { Link } from "react-router-dom";
import { CitySearch } from "./CitySearch";
import { Settings } from "./Settings";
import type { Theme, TimeFormat, LunarSystem } from "../constants";
import "../styles/Header.css";

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  timeFormat: TimeFormat;
  onToggleTimeFormat: () => void;
  lunarSystem: LunarSystem;
  onToggleLunarSystem: () => void;
}

export function Header({
  theme,
  onToggleTheme,
  timeFormat,
  onToggleTimeFormat,
  lunarSystem,
  onToggleLunarSystem,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header__top">
        <Link to="/" className="header__title">
          Panchangam
        </Link>
        <CitySearch />
        <Settings
          theme={theme}
          onToggleTheme={onToggleTheme}
          timeFormat={timeFormat}
          onToggleTimeFormat={onToggleTimeFormat}
          lunarSystem={lunarSystem}
          onToggleLunarSystem={onToggleLunarSystem}
        />
      </div>
    </header>
  );
}
