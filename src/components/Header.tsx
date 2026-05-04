import type { Theme } from "../constants";
import "../styles/Header.css";

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="header">
      <span className="header__title">Panchangam</span>
      <button
        className="header__theme-toggle"
        onClick={onToggleTheme}
        aria-label="Toggle theme"
      >
        {theme === "light" ? "☽" : "☀"}
      </button>
    </header>
  );
}
