import Head from 'next/head';
import HomeSection from '../src/components/HomeSection/HomeSection';
import CountdownSection from '../src/components/CountdownSection/CountdownSection';
import MapSection from '../src/components/MapSection/MapSection';
import Navigation from '../src/components/Navigation/Navigation';
import Itinerary from '../src/components/HomeSection/Itinerary';
import DressCode from '../src/components/DressCode/DressCode';
import GiftsSection from '../src/components/GiftsSection/GiftsSection';
import styles from '../styles/Home.module.css';
// Esta es una página de ejemplo - las invitaciones reales usan /rsvp/[eventId]/[groupId]
// Images are now served from public/images/

const ShapeDivider = () => (
  <div className={styles.shapeDivider}>
     <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z" className={styles.shapeFill}></path>
    </svg>
  </div>
);

const ShapeDividerBottom = () => (
  <div className={styles.shapeDividerBottom}>
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" className={styles.shapeFill}></path>
    </svg>
  </div>
);

const ExamplePage = () => {
  return (
    <>
      <Head>
        <title>Boda de Mer y Juan | 25 de octubre del 2025</title>
        <meta name="description" content="🎉 ¡Ya casi comienza nuestra pato-aventura! 🦆💛 Después de tanto planear, soñar y reír... ¡nos casamos! 💍 Queremos que seas parte de este día tan especial para nosotros. Tu presencia haría nuestra celebración aún más bonita 🌷✨ 📅 25-10-25 📍 Las Nubes, Santiago, Nuevo León" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://meryjuan.dingerbites.com/" />
        <meta property="og:title" content="Boda de Mer y Juan | 25 de octubre del 2025" />
        <meta property="og:description" content="🎉 ¡Ya casi comienza nuestra pato-aventura! 🦆💛 Después de tanto planear, soñar y reír... ¡nos casamos! 💍 Queremos que seas parte de este día tan especial para nosotros. Tu presencia haría nuestra celebración aún más bonita 🌷✨ 📅 25-10-25 📍 Las Nubes, Santiago, Nuevo León" />
        <meta property="og:image" content="https://meryjuan.dingerbites.com/images/icon.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Boda de Mer y Juan" />
        <meta property="og:locale" content="es_ES" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://meryjuan.dingerbites.com/" />
        <meta property="twitter:title" content="Boda de Mer y Juan | 25 de octubre del 2025" />
        <meta property="twitter:description" content="🎉 ¡Ya casi comienza nuestra pato-aventura! 🦆💛 Después de tanto planear, soñar y reír... ¡nos casamos! 💍 Queremos que seas parte de este día tan especial para nosotros. Tu presencia haría nuestra celebración aún más bonita 🌷✨ 📅 25-10-25 📍 Las Nubes, Santiago, Nuevo León" />
        <meta property="twitter:image" content="https://meryjuan.dingerbites.com/images/icon.jpg" />
        
        {/* Link canonical */}
        <link rel="canonical" href="https://meryjuan.dingerbites.com/" />
      </Head>
      
      <div className={styles.page}>
      <HomeSection />
      <Navigation />
      <CountdownSection />
      <div className={styles.imageSection}>
        <ShapeDivider />
        <img src="/images/step2.jpeg" alt="step2" className={styles.between} />
        <ShapeDividerBottom />
      </div>
      <MapSection />
      <div className={styles.imageSection}>
        <ShapeDivider />
        <img src="/images/inBetween1.jpeg" alt="inBetween1" className={styles.between} />
        <ShapeDividerBottom />
      </div>
      <Itinerary />
      <div className={styles.imageSection}>
        <ShapeDivider />
        <img src="/images/inBetween2.jpeg" alt="inBetween2" className={styles.between} />
        <ShapeDividerBottom />
      </div>
      <DressCode />
      <div className={styles.imageSection}>
        <ShapeDivider />
        <img src="/images/step3.jpeg" alt="step3" className={styles.between} />
        <ShapeDividerBottom />
      </div>
      <GiftsSection />

      </div>
    </>
  );
};

export default ExamplePage; 