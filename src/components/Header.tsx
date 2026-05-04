import { library, findIconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Theme } from "../constants";
import "../styles/Header.css";

library.add(faSun, faMoon);

const sunIcon = findIconDefinition({ prefix: "fas", iconName: "sun" });
const moonIcon = findIconDefinition({ prefix: "fas", iconName: "moon" });

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="header">
      <span className="header__title">Panchangam</span>
      <button
        className={`header__theme-toggle header__theme-toggle--${theme}`}
        onClick={onToggleTheme}
        aria-label="Toggle theme"
      >
        <FontAwesomeIcon icon={theme === "light" ? sunIcon : moonIcon} />
      </button>
    </header>
  );
}
