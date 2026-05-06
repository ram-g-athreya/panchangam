import { library, findIconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faSun, faMoon, faHouse, faHandsPraying } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import type { Theme } from "../constants";
import "../styles/Sidebar.css";

library.add(faSun, faMoon, faHouse, faHandsPraying);

const sunIcon = findIconDefinition({ prefix: "fas", iconName: "sun" });
const moonIcon = findIconDefinition({ prefix: "fas", iconName: "moon" });
const houseIcon = findIconDefinition({ prefix: "fas", iconName: "house" });
const handsPrayingIcon = findIconDefinition({ prefix: "fas", iconName: "hands-praying" });

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Sidebar({ isOpen, onClose, theme, onToggleTheme }: SidebarProps) {
  const navClass = ({ isActive }: { isActive: boolean }): string =>
    `sidebar__nav-link${isActive ? " sidebar__nav-link--active" : ""}`;

  return (
    <div className={`sidebar-overlay${isOpen ? " sidebar-overlay--open" : ""}`} onClick={onClose}>
      <aside
        className={`sidebar${isOpen ? " sidebar--open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="sidebar__nav">
          <NavLink to="/" end className={navClass} onClick={onClose}>
            <FontAwesomeIcon icon={houseIcon} className="sidebar__nav-icon" />
            Home
          </NavLink>
          <NavLink to="/sankalpam" className={navClass} onClick={onClose}>
            <FontAwesomeIcon icon={handsPrayingIcon} className="sidebar__nav-icon" />
            Sankalpam
          </NavLink>
        </nav>
        <div className="sidebar__footer">
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
            <span className="theme-toggle__label">{theme === "light" ? "Light" : "Dark"}</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
