import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { DailyView } from "./pages/DailyView";
import { Sankalpam } from "./pages/Sankalpam";
import type { Theme } from "./constants";
import { THEME_KEY } from "./constants";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === "dark" ? "dark" : "light";
}

export function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

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

  return (
    <BrowserRouter>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<DailyView />} />
        <Route path="/home" element={<DailyView />} />
        <Route path="/sankalpam" element={<Sankalpam />} />
      </Routes>
    </BrowserRouter>
  );
}
