import { useState, useEffect } from 'react';
import { ThemeContext } from '../hooks/useTheme';
import { ACCENT_THEMES } from '../data/themes';

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('lifeos-theme');
    return saved ? saved === 'dark' : false;
  });

  const [accentKey, setAccentKey] = useState(() => {
    return localStorage.getItem('lifeos-accent') || 'blue';
  });

  const accent = ACCENT_THEMES.find(t => t.key === accentKey) || ACCENT_THEMES[0];

  useEffect(() => {
    localStorage.setItem('lifeos-theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('lifeos-accent', accentKey);
    document.documentElement.style.setProperty('--color-primary', accent.primary);
    document.documentElement.style.setProperty('--color-secondary', accent.secondary);
  }, [accentKey, accent]);

  const toggleTheme = () => setIsDark(prev => !prev);
  const setAccent = (key) => setAccentKey(key);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, accent, accentKey, setAccent, ACCENT_THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};
