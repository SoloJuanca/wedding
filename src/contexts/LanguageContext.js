import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import esMessages from '../locales/es.json';
import enMessages from '../locales/en.json';
import koMessages from '../locales/ko.json';

const messages = {
  es: esMessages,
  en: enMessages,
  ko: koMessages
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const router = useRouter();
  const [locale, setLocale] = useState('es'); // Default to Spanish

  useEffect(() => {
    // First priority: URL locale from Next.js router
    if (router.locale && messages[router.locale]) {
      setLocale(router.locale);
    } else {
      // Fallback to localStorage preference
      const savedLocale = localStorage.getItem('locale');
      if (savedLocale && messages[savedLocale]) {
        setLocale(savedLocale);
      }
    }
  }, [router.locale]);

  const changeLanguage = (newLocale) => {
    if (messages[newLocale]) {
      setLocale(newLocale);
      localStorage.setItem('locale', newLocale);
      // Use Next.js router to change locale
      router.push(router.asPath, router.asPath, { locale: newLocale });
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