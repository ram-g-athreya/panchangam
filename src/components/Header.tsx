import { library, findIconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";
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
  const navClass = ({ isActive }: { isActive: boolean }): string =>
    `header__nav-link${isActive ? " header__nav-link--active" : ""}`;

  return (
    <header className="header">
      <div className="header__top">
        <Link to="/" className="header__title">Panchangam</Link>
        <button
          className={`theme-toggle theme-toggle--${theme}`}
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          <span className="theme-toggle__thumb">
            <FontAwesomeIcon
              icon={theme === "light" ? sunIcon : moonIcon}
              className="theme-toggle__icon"
            />
          </span>
          <span className="theme-toggle__label">
            {theme === "light" ? "Light" : "Dark"}
          </span>
        </button>
      </div>
      <nav className="header__nav">
        <NavLink to="/home" className={navClass}>Home</NavLink>
        <NavLink to="/sankalpam" className={navClass}>Sankalpam</NavLink>
      </nav>
    </header>
  );
}
