import React, { useEffect, useState } from 'react';
import { Link } from 'react-scroll';
import styles from './Navigation.module.css';

const Navigation = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const homeSection = document.getElementById('home');
      if (homeSection) {
        const homeSectionBottom = homeSection.getBoundingClientRect().bottom;
        setIsSticky(homeSectionBottom <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${isSticky ? styles.sticky : ''}`}>
      <Link
        to="home"
        spy={true}
        smooth={true}
        offset={-70}
        duration={500}
        className={styles.link}
        activeClass={styles.active}
      >
        Home
      </Link>
      <Link
        to="countdown"
        spy={true}
        smooth={true}
        offset={-70}
        duration={500}
        className={styles.link}
        activeClass={styles.active}
      >
        Countdown
      </Link>
      <Link
        to="location"
        spy={true}
        smooth={true}
        offset={-70}
        duration={500}
        className={styles.link}
        activeClass={styles.active}
      >
        Location
      </Link>
    </nav>
  );
};

export default Navigation; 