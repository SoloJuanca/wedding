import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Itinerary.module.css';
// Images are now served from public/images/

const Itinerary = () => {
  const { messages } = useLanguage();

  const events = [
    { time: messages['itinerary.time.6pm'], title: messages['itinerary.civilWedding'], icon: '/images/civil.png' },
    { time: messages['itinerary.time.7pm'], title: messages['itinerary.religiousCeremony'], icon: '/images/misa.png' },
    { time: messages['itinerary.time.8pm'], title: messages['itinerary.reception'], icon: '/images/party.png' },
    { time: messages['itinerary.time.2am'], title: messages['itinerary.endReception'], icon: '/images/party.png' },
  ];

  return (
  <div id="itinerary" className={styles.itineraryContainer}>
      <h2 className={styles.title}>{messages['itinerary.title']}</h2>
      <h3 className={styles.subtitle}>{messages['itinerary.date']}</h3>
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
};

export default Itinerary; 