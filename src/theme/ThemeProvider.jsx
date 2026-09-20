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
    <div className="theme-selector" role="group" aria-label="Theme">
      {/** @type {ThemePreference[]} */ (["system", "light", "dark"]).map((theme) => (
        <button
          key={theme}
          type="button"
          className="theme-selector__button"
          aria-label={`${theme[0].toUpperCase()}${theme.slice(1)} theme`}
          title={`${theme[0].toUpperCase()}${theme.slice(1)} theme`}
          aria-pressed={preference === theme}
          onClick={() => selectTheme(theme)}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            {theme === "system" && <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M12 17v4m-4 0h8" /></>}
            {theme === "light" && <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42m0-14.14-1.42 1.42m-11.3 11.3-1.42 1.42" /></>}
            {theme === "dark" && <path d="M20.9 13.3A9 9 0 0 1 10.7 3.1a9 9 0 1 0 10.2 10.2Z" />}
          </svg>
        </button>
      ))}
    </div>
  );
}
