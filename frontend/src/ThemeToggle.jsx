import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('abhisaran_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('abhisaran_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme, setTheme };
}

export default function ThemeToggle({ className, style }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className || ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        padding: '0.4rem 0.75rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-main)',
        fontSize: '0.8rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: 'var(--shadow-sm)',
        ...style
      }}
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      aria-label="Toggle visual theme"
    >
      {theme === 'light' ? (
        <>
          <Moon size={15} style={{ color: 'var(--brand-primary)' }} />
          <span>Dark</span>
        </>
      ) : (
        <>
          <Sun size={15} style={{ color: 'var(--brand-accent)' }} />
          <span>Light</span>
        </>
      )}
    </button>
  );
}
