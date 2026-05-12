import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { DailyView } from "./pages/DailyView";
import { Sankalpam } from "./pages/Sankalpam";
import type { Theme, TimeFormat } from "./constants";
import { THEME_KEY, TIME_FORMAT_KEY } from "./constants";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === "dark" ? "dark" : "light";
}

function getInitialTimeFormat(): TimeFormat {
  const stored = localStorage.getItem(TIME_FORMAT_KEY);
  return stored === "24h" ? "24h" : "12h";
}

export function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(getInitialTimeFormat);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <BrowserRouter>
      <Header
        onOpenSidebar={() => setSidebarOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        timeFormat={timeFormat}
        onToggleTimeFormat={toggleTimeFormat}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Routes>
        <Route path="/" element={<DailyView timeFormat={timeFormat} />} />
        <Route path="/sankalpam" element={<Sankalpam />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}
