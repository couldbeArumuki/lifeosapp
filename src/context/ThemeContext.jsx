import { useState, useEffect } from 'react';
import { ThemeContext } from '../hooks/useTheme';

const ACCENTS = ['blue', 'purple', 'green', 'rose'];

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('lifeos-theme');
    return saved ? saved === 'dark' : false;
  });
  const [accent, setAccentState] = useState(() => {
    return localStorage.getItem('lifeos-accent') || 'blue';
  });

  useEffect(() => {
    localStorage.setItem('lifeos-theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('lifeos-accent', accent);
    ACCENTS.forEach(a => document.documentElement.classList.remove(`accent-${a}`));
    if (accent !== 'blue') {
      document.documentElement.classList.add(`accent-${accent}`);
    }
  }, [accent]);

  const toggleTheme = () => setIsDark(prev => !prev);
  const setAccent = (a) => setAccentState(a);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};
