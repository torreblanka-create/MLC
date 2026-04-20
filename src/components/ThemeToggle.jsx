import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('ind_theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('light');
      localStorage.setItem('ind_theme', 'dark');
    } else {
      html.classList.add('light');
      localStorage.setItem('ind_theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      className={styles.toggle}
      onClick={() => setIsDark(!isDark)}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={isDark ? 'Tema claro' : 'Tema oscuro'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
