import React from 'react';
import HomeSection from '../../components/HomeSection/HomeSection';
import CountdownSection from '../../components/CountdownSection/CountdownSection';
import MapSection from '../../components/MapSection/MapSection';
import Navigation from '../../components/Navigation/Navigation';
import Itinerary from '../../components/HomeSection/Itinerary';
import DressCode from '../../components/DressCode/DressCode';
import styles from './InvitePage.module.css';
import inBetween1 from '../../assets/images/inBetween1.jpeg';
import inBetween2 from '../../assets/images/inBetween2.jpeg';

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

const InvitePage = () => {
  return (
    <div className={styles.page}>
      <HomeSection />
      <Navigation />
      <CountdownSection />
      <MapSection />
      <div className={styles.imageSection}>
        <ShapeDivider />
        <img src={inBetween1} alt="inBetween1" className={styles.between} />
        <ShapeDividerBottom />
      </div>
      <Itinerary />
      <div className={styles.imageSection}>
        <ShapeDivider />
        <img src={inBetween2} alt="inBetween2" className={styles.between} />
        <ShapeDividerBottom />
      </div>
      <DressCode />
    </div>
  );
};

export default InvitePage; 