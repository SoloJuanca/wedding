import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Boda de Mer y Juan | 25 de octubre del 2025"
        />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://meryjuan.dingerbites.com/" />
        <meta property="og:title" content="Boda de Mer y Juan | 25 de octubre del 2025" />
        <meta property="og:description" content="Te invitamos a celebrar nuestra boda. ¡Acompáñanos en este día tan especial!" />
        <meta property="og:image" content="https://meryjuan.dingerbites.com/images/icon.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Boda de Mer y Juan" />
        <meta property="og:locale" content="es_ES" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://meryjuan.dingerbites.com/" />
        <meta property="twitter:title" content="Boda de Mer y Juan | 25 de octubre del 2025" />
        <meta property="twitter:description" content="Te invitamos a celebrar nuestra boda. ¡Acompáñanos en este día tan especial!" />
        <meta property="twitter:image" content="https://meryjuan.dingerbites.com/images/icon.jpg" />
        
        {/* Additional meta tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Mer y Juan" />
        <link rel="canonical" href="https://meryjuan.dingerbites.com/" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 