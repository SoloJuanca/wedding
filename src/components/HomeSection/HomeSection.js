import React from 'react';
import { motion } from 'framer-motion';
import { useIntl } from 'react-intl';
import styles from './HomeSection.module.css';
import backgroundImage from '../../assets/Center.png';
import heroImage from '../../assets/images/hero.jpeg';

const HomeSection = () => {
  const intl = useIntl();

  return (
    <section id="home" className={styles.section}>
      <div className={styles.contentWrapper}>
        <motion.div 
          className={styles.heroImage}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src={heroImage} alt="Hero" />
        </motion.div>
        
        <motion.div 
          className={styles.textContent}
          style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url(${backgroundImage})` }}
        >
          
          <motion.h2
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {intl.formatMessage({ id: 'home.subtitle' })}
          </motion.h2>

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {intl.formatMessage({ id: 'home.bride' })}
            <br />
            &
            <br />
            {intl.formatMessage({ id: 'home.groom' })}
          </motion.h1>
          
          <motion.div
            className={styles.dateLocation}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p>{intl.formatMessage({ id: 'home.date' })}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeSection; 