import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // التحقق من الإعداد المحفوظ
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // التحقق من تفضيل النظام
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // حفظ الإعداد
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // تطبيق الكلاس على body
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      primary: isDarkMode ? '#4A90E2' : '#3498db',
      secondary: isDarkMode ? '#7B68EE' : '#9b59b6',
      success: isDarkMode ? '#2ECC71' : '#27ae60',
      danger: isDarkMode ? '#E74C3C' : '#e74c3c',
      warning: isDarkMode ? '#F39C12' : '#f39c12',
      info: isDarkMode ? '#3498DB' : '#3498db',
      light: isDarkMode ? '#2C3E50' : '#ecf0f1',
      dark: isDarkMode ? '#ECF0F1' : '#2c3e50',
      background: isDarkMode ? '#1A1A1A' : '#ffffff',
      surface: isDarkMode ? '#2D2D2D' : '#f8f9fa',
      text: isDarkMode ? '#ECF0F1' : '#2c3e50',
      textSecondary: isDarkMode ? '#BDC3C7' : '#7f8c8d',
      border: isDarkMode ? '#404040' : '#e0e6ed',
      shadow: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
