import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { DailyView } from "./pages/DailyView";
import type { Theme } from "./constants";

export function App() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  return (
    <div>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <DailyView />
    </div>
  );
}
