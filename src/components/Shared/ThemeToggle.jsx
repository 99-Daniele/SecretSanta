import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label={`Passa a tema ${theme === 'light' ? 'scuro' : 'chiaro'}`}
      title={`Tema ${theme === 'light' ? 'chiaro' : 'scuro'} attivo - Clicca per cambiare`}
    >
      <span className={styles.icon}>
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  );
};

export default ThemeToggle;
