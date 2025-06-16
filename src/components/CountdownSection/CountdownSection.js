import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIntl } from 'react-intl';
import styles from './CountdownSection.module.css';
// Images are now served from public/images/

const CountdownSection = () => {
  const intl = useIntl();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const weddingDate = new Date('2025-10-25T00:00:00');

    const calculateTimeLeft = () => {
      const difference = weddingDate - new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="countdown" className={styles.section}>
      <motion.div
        className={styles.titleContainer}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <img 
          src="/images/countdown1.png" 
          alt={intl.formatMessage({ id: 'countdown.title' })}
          className={styles.titleImage}
        />
      </motion.div>

      <motion.div
        className={styles.countdownContainer}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className={styles.timeUnit}>
          <div className={styles.number}>{timeLeft.days}</div>
          <div className={styles.label}>{intl.formatMessage({ id: 'countdown.days' })}</div>
        </div>
        <div className={styles.timeUnit}>
          <div className={styles.number}>{timeLeft.hours}</div>
          <div className={styles.label}>{intl.formatMessage({ id: 'countdown.hours' })}</div>
        </div>
        <div className={styles.timeUnit}>
          <div className={styles.number}>{timeLeft.minutes}</div>
          <div className={styles.label}>{intl.formatMessage({ id: 'countdown.minutes' })}</div>
        </div>
        <div className={styles.timeUnit}>
          <div className={styles.number}>{timeLeft.seconds}</div>
          <div className={styles.label}>{intl.formatMessage({ id: 'countdown.seconds' })}</div>
        </div>
      </motion.div>
    </section>
  );
};

export default CountdownSection; 