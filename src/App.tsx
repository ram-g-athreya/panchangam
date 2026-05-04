import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { DailyView } from "./pages/DailyView";

export type Theme = "light" | "dark";

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
