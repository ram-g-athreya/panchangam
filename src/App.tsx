import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "./components/Header";
import { DailyView } from "./pages/DailyView";
import type { Theme, TimeFormat, LunarSystem } from "./constants";
import { THEME_KEY, TIME_FORMAT_KEY, LUNAR_SYSTEM_KEY } from "./constants";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === "dark" ? "dark" : "light";
}

function getInitialTimeFormat(): TimeFormat {
  const stored = localStorage.getItem(TIME_FORMAT_KEY);
  return stored === "24h" ? "24h" : "12h";
}

function getInitialLunarSystem(): LunarSystem {
  const stored = localStorage.getItem(LUNAR_SYSTEM_KEY);
  return stored === "purnimanta" ? "purnimanta" : "amanta";
}

export function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(getInitialTimeFormat);
  const [lunarSystem, setLunarSystem] = useState<LunarSystem>(getInitialLunarSystem);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => {
      const next = t === "light" ? "dark" : "light";
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }

  function toggleTimeFormat() {
    setTimeFormat((f) => {
      const next = f === "12h" ? "24h" : "12h";
      localStorage.setItem(TIME_FORMAT_KEY, next);
      return next;
    });
  }

  function toggleLunarSystem() {
    setLunarSystem((l) => {
      const next = l === "amanta" ? "purnimanta" : "amanta";
      localStorage.setItem(LUNAR_SYSTEM_KEY, next);
      return next;
    });
  }

  return (
    <BrowserRouter>
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        timeFormat={timeFormat}
        onToggleTimeFormat={toggleTimeFormat}
        lunarSystem={lunarSystem}
        onToggleLunarSystem={toggleLunarSystem}
      />
      <Routes>
        <Route path="/" element={<DailyView timeFormat={timeFormat} lunarSystem={lunarSystem} />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}
