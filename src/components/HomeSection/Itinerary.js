import React from 'react';
import styles from './Itinerary.module.css';
// Images are now served from public/images/

const events = [
  { time: '6:00 p.m.', title: 'Boda Civil', icon: '/images/civil.png' },
  { time: '7:00 p.m.', title: 'Misa', icon: '/images/misa.png' },
  { time: '8:00 p.m.', title: 'Fiesta', icon: '/images/party.png' },
];

const Itinerary = () => (
  <div id="itinerary" className={styles.itineraryContainer}>
    <h2 className={styles.title}>Itinerario</h2>
    <h3 className={styles.subtitle}>Sábado 25 de Octubre, 2025</h3>
    <ul className={styles.timeline}>
      {events.map((event, idx) => (
        <li
          key={idx}
          className={
            styles.timelineItem + ' ' + (idx % 2 === 0 ? styles.left : styles.right)
          }
        >
          {idx % 2 === 0 ? (
            <>
              <div className={styles.card}>
                <div className={styles.icon}>
                  <img src={event.icon} alt={event.title} />
                </div>
                <div className={styles.time}>{event.time}</div>
                <div className={styles.event}>{event.title}</div>
              </div>
              <span className={styles.dot}></span>
              <div style={{ flex: 1 }}></div>
            </>
          ) : (
            <>
              <div style={{ flex: 1 }}></div>
              <span className={styles.dot}></span>
              <div className={styles.card}>
                <div className={styles.icon}>
                  <img src={event.icon} alt={event.title} />
                </div>
                <div className={styles.time}>{event.time}</div>
                <div className={styles.event}>{event.title}</div>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default Itinerary; 