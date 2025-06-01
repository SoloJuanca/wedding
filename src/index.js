import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const IntlAndRouter = () => {
  const { locale, messages } = useLanguage();
  console.log('Locale:', locale, 'Messages:', messages); // Debug line

  return (
    <IntlProvider messages={messages} locale={locale} defaultLocale="es">
      <Router>
        <App />
      </Router>
    </IntlProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <IntlAndRouter />
    </LanguageProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
