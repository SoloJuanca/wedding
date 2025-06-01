import React from 'react';
import HomeSection from '../../components/HomeSection/HomeSection';
import CountdownSection from '../../components/CountdownSection/CountdownSection';
import MapSection from '../../components/MapSection/MapSection';
import Navigation from '../../components/Navigation/Navigation';
import styles from './InvitePage.module.css';

const InvitePage = () => {
  return (
    <div className={styles.page}>
      <HomeSection />
      <Navigation />
      <CountdownSection />
      <MapSection />
    </div>
  );
};

export default InvitePage; 