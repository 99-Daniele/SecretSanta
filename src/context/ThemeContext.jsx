import { createContext, useContext, useState, useEffect } from 'react';
/* eslint-disable react-refresh/only-export-components */

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Leggi dal localStorage o usa 'light' come default
    const savedTheme = localStorage.getItem('secretsanta-theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    // Salva nel localStorage quando cambia
    localStorage.setItem('secretsanta-theme', theme);
    
    // Aggiungi la classe al body
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve essere usato all\'interno di ThemeProvider');
  }
  return context;
};
