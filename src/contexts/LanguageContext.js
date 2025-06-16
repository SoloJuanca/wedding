import { createContext, useState, useContext, useEffect } from 'react';
import esMessages from '../locales/es.json';
import enMessages from '../locales/en.json';

const messages = {
  es: esMessages,
  en: enMessages
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState('es'); // Default to Spanish

  useEffect(() => {
    // Check if user has a language preference in localStorage
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && messages[savedLocale]) {
      setLocale(savedLocale);
    }
  }, []);

  const changeLanguage = (newLocale) => {
    if (messages[newLocale]) {
      setLocale(newLocale);
      localStorage.setItem('locale', newLocale);
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, messages: messages[locale], changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 