import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-scroll';
import styles from './Navigation.module.css';

const Navigation = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const homeSection = document.getElementById('home');
      if (homeSection) {
        const homeSectionBottom = homeSection.getBoundingClientRect().bottom;
        setIsSticky(homeSectionBottom <= 0);
      }

      // Detect which section is currently active
      const sections = ['home', 'countdown', 'location', 'itinerary', 'dresscode', 'gifts', 'rsvp'];
      const scrollPosition = window.scrollY + 150; // offset for better detection
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          if (activeSection !== sections[i]) {
            setActiveSection(sections[i]);
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  // Center the active link in the navigation
  useEffect(() => {
    const centerActiveLink = () => {
      const navElement = navRef.current;
      
      if (navElement) {
        // Find the active link element using class selector
        const activeLinkElement = navElement.querySelector(`.${styles.active}`);
        
        if (activeLinkElement) {
          const navRect = navElement.getBoundingClientRect();
          const linkRect = activeLinkElement.getBoundingClientRect();
          
          // Calculate the position to center the active link
          const navCenter = navRect.width / 2;
          const linkCenter = linkRect.left - navRect.left + linkRect.width / 2;
          const scrollLeft = navElement.scrollLeft + linkCenter - navCenter;
          
          // Smooth scroll to center the active link
          navElement.scrollTo({
            left: Math.max(0, scrollLeft),
            behavior: 'smooth'
          });
        }
      }
    };

    // Small delay to ensure the DOM is updated
    const timeoutId = setTimeout(centerActiveLink, 100);
    return () => clearTimeout(timeoutId);
  }, [activeSection]);

  const navItems = [
    { to: 'home', label: 'Inicio' },
    { to: 'countdown', label: 'Cuenta Regresiva' },
    { to: 'location', label: 'Ubicación' },
    { to: 'itinerary', label: 'Itinerario' },
    { to: 'dresscode', label: 'Código Vestimenta' },
    { to: 'gifts', label: 'Regalos' },
    { to: 'rsvp', label: 'RSVP' }
  ];

  const handleLinkClick = (section) => {
    setActiveSection(section);
  };

  return (
    <nav ref={navRef} className={`${styles.nav} ${isSticky ? styles.sticky : ''}`}>
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          spy={true}
          smooth={true}
          offset={-100}
          duration={500}
          className={`${styles.link} ${activeSection === item.to ? styles.active : ''}`}
          onClick={() => handleLinkClick(item.to)}
          onSetActive={() => setActiveSection(item.to)}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation; 