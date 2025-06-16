import { IntlProvider } from 'react-intl';
import { LanguageProvider, useLanguage } from '../src/contexts/LanguageContext';
import '../src/index.css';
import '../src/App.css';

const IntlWrapper = ({ children }) => {
  const { locale, messages } = useLanguage();

  return (
    <IntlProvider messages={messages} locale={locale} defaultLocale="es">
      {children}
    </IntlProvider>
  );
};

function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <IntlWrapper>
        <div className="app">
          <main className="main">
            <Component {...pageProps} />
          </main>
        </div>
      </IntlWrapper>
    </LanguageProvider>
  );
}

export default MyApp; 