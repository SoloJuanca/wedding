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
  );
};

export default ExamplePage; 