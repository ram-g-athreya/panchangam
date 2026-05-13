import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { Moon, LunarPhase } from "lunarphase-js";
import type { Theme, TimeFormat, LunarSystem } from "../constants";
import "../styles/Settings.css";

const moonEmojiBySystem = {
  amanta: Moon.emojiForLunarPhase(LunarPhase.NEW),
  purnimanta: Moon.emojiForLunarPhase(LunarPhase.FULL),
};

interface SettingsProps {
  theme: Theme;
  onToggleTheme: () => void;
  timeFormat: TimeFormat;
  onToggleTimeFormat: () => void;
  lunarSystem: LunarSystem;
  onToggleLunarSystem: () => void;
}

export function Settings({
  theme,
  onToggleTheme,
  timeFormat,
  onToggleTimeFormat,
  lunarSystem,
  onToggleLunarSystem,
}: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="settings" ref={ref}>
      <button
        className={`settings__btn${isOpen ? " settings__btn--active" : ""}`}
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Settings"
      >
        <FontAwesomeIcon icon={faGear} />
      </button>
      {isOpen && (
        <div className="settings__callout">
          <div className="settings__row">
            <span className="settings__label">Time</span>
            <button
              className={`time-format-toggle time-format-toggle--${timeFormat}`}
              onClick={onToggleTimeFormat}
              aria-label="Toggle time format"
            >
              <span className="time-format-toggle__thumb" />
              <span className="time-format-toggle__label">
                {timeFormat === "12h" ? "12-hour" : "24-hour"}
              </span>
            </button>
          </div>
          <hr className="settings__separator" />
          <div className="settings__row">
            <span className="settings__label">Lunar System</span>
            <button
              className={`lunar-system-toggle lunar-system-toggle--${lunarSystem}`}
              onClick={onToggleLunarSystem}
              aria-label="Toggle lunar system"
            >
              <span className="lunar-system-toggle__thumb">{moonEmojiBySystem[lunarSystem]}</span>
              <span className="lunar-system-toggle__label">
                {lunarSystem === "amanta" ? "Amānta" : "Pūrṇimānta"}
              </span>
            </button>
          </div>
          <hr className="settings__separator" />
          <div className="settings__row">
            <span className="settings__label">Theme</span>
            <button
              className={`theme-toggle theme-toggle--${theme}`}
              onClick={onToggleTheme}
              aria-label="Toggle theme"
            >
              <span className="theme-toggle__thumb">
                <FontAwesomeIcon
                  icon={theme === "light" ? faSun : faMoon}
                  className="theme-toggle__icon"
                />
              </span>
              <span className="theme-toggle__label">{theme === "light" ? "Light" : "Dark"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
