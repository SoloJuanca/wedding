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

  // Event details for calendar
  const eventDetails = {
    title: 'Boda - Ceremonia y Celebración',
    startDate: '2025-10-25T18:00:00', // 6:00 PM
    endDate: '2025-10-26T02:00:00',   // 2:00 AM next day
    location: 'Santiago, Nuevo León, México',
    description: 'Ceremonia religiosa y civil seguida de celebración. 6:00 PM - Boda Civil | 7:00 PM - Ceremonia Religiosa | 8:00 PM - Recepción'
  };

  // Generate .ics file content
  const generateICSContent = () => {
    const startDate = new Date(eventDetails.startDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(eventDetails.endDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//ES
BEGIN:VEVENT
UID:wedding-${now}@wedding-invitation.com
DTSTAMP:${now}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description}
LOCATION:${eventDetails.location}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`.replace(/\n/g, '\r\n');
  };

  // Download .ics file
  const downloadICSFile = () => {
    const icsContent = generateICSContent();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'boda-invitacion.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Generate Google Calendar URL
  const getGoogleCalendarURL = () => {
    const startDate = new Date(eventDetails.startDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(eventDetails.endDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: eventDetails.title,
      dates: `${startDate}/${endDate}`,
      details: eventDetails.description,
      location: eventDetails.location,
      trp: 'false'
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Generate Outlook Calendar URL
  const getOutlookCalendarURL = () => {
    const startDate = new Date(eventDetails.startDate).toISOString();
    const endDate = new Date(eventDetails.endDate).toISOString();
    
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: eventDetails.title,
      startdt: startDate,
      enddt: endDate,
      body: eventDetails.description,
      location: eventDetails.location
    });
    
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  };

  // Generate Yahoo Calendar URL
  const getYahooCalendarURL = () => {
    const startDate = new Date(eventDetails.startDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(eventDetails.endDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const params = new URLSearchParams({
      v: '60',
      view: 'd',
      type: '20',
      title: eventDetails.title,
      st: startDate,
      et: endDate,
      desc: eventDetails.description,
      in_loc: eventDetails.location
    });
    
    return `https://calendar.yahoo.com/?${params.toString()}`;
  };

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

      <motion.div
        className={styles.calendarSection}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h3 className={styles.calendarTitle}>{intl.formatMessage({ id: 'calendar.addToCalendar' })}</h3>
        <p className={styles.calendarSubtitle}>{intl.formatMessage({ id: 'calendar.dontForgetDate' })}</p>
        
        <div className={styles.calendarButtons}>
          <button
            onClick={downloadICSFile}
            className={`${styles.calendarButton} ${styles.icsButton}`}
            title={intl.formatMessage({ id: 'calendar.downloadICS' })}
          >
            📅 {intl.formatMessage({ id: 'calendar.downloadICS' })}
          </button>
          
          <a
            href={getGoogleCalendarURL()}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.calendarButton} ${styles.googleButton}`}
          >
            🗓️ {intl.formatMessage({ id: 'calendar.googleCalendar' })}
          </a>
          
          <a
            href={getOutlookCalendarURL()}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.calendarButton} ${styles.outlookButton}`}
          >
            📆 {intl.formatMessage({ id: 'calendar.outlook' })}
          </a>
          
          <a
            href={getYahooCalendarURL()}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.calendarButton} ${styles.yahooButton}`}
          >
            🗓️ {intl.formatMessage({ id: 'calendar.yahooCalendar' })}
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default CountdownSection; 