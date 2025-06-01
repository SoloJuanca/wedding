import React from 'react';
import styles from './DressCode.module.css';

const Rules = () => {
  return (
    <div className={styles.dressCodeContainer}>
      <h2 className={styles.title}>Reglas</h2>
      <h3 className={styles.subtitle}>Información importante</h3>
      
      <div className={styles.rulesContainer}>
        <div className={styles.rule}>
          <div className={styles.icon}>
            <img src="/icons/gala.png" alt="Vestimenta de rigurosa etiqueta" />
          </div>
          <p className={styles.ruleText}>Vestimenta de rigurosa etiqueta</p>
        </div>

        <div className={styles.rule}>
          <div className={styles.icon}>
            <img src="/icons/white.png" alt="No beige, no blanco" />
          </div>
          <p className={styles.ruleText}>No beige, no blanco</p>
        </div>

        <div className={styles.rule}>
          <div className={styles.icon}>
            <img src="/icons/kids.png" alt="No niños" />
          </div>
          <p className={styles.ruleText}>No niños</p>
        </div>
      </div>
    </div>
  );
};

export default Rules; 