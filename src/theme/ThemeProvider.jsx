import React, { createContext, useContext, useLayoutEffect, useState } from "react";

/** @typedef {"system" | "light" | "dark"} ThemePreference */
/** @typedef {"light" | "dark"} Appearance */

const ThemeContext = createContext(/** @type {{preference: ThemePreference, appearance: Appearance, selectTheme: (preference: ThemePreference) => void} | null} */ (null));

/** @param {{children: React.ReactNode}} props */
export function ThemeProvider({ children }) {
  // The blocking head script validates storage and resolves the initial appearance.
  const [preference, setPreference] = useState(/** @type {ThemePreference} */ (document.documentElement.dataset.themePreference));
  const [appearance, setAppearance] = useState(/** @type {Appearance} */ (document.documentElement.dataset.theme));

  useLayoutEffect(() => {
    const device = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const resolved = preference === "system" ? (device.matches ? "dark" : "light") : preference;
      document.documentElement.dataset.theme = resolved;
      document.documentElement.dataset.themePreference = preference;
      setAppearance(resolved);
    };
    apply();
    if (preference !== "system") return;
    device.addEventListener("change", apply);
    return () => device.removeEventListener("change", apply);
  }, [preference]);

  /** @param {ThemePreference} next */
  const selectTheme = (next) => {
    setPreference(next);
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch { /* Keep the in-memory choice usable when persistence is unavailable. */ }
  };

  return <ThemeContext.Provider value={{ preference, appearance, selectTheme }}>{children}</ThemeContext.Provider>;
}

export function ThemeSelector() {
  const { preference, selectTheme } = useContext(ThemeContext);
  return (
    <label className="theme-selector">
      <span>Theme</span>
      <select value={preference} onChange={(event) => selectTheme(/** @type {ThemePreference} */ (event.target.value))}>
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
