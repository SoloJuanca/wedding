import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import ReactPlayer from 'react-player';
import HomeSection from '../../../src/components/HomeSection/HomeSection';
import CountdownSection from '../../../src/components/CountdownSection/CountdownSection';
import MapSection from '../../../src/components/MapSection/MapSection';
import Navigation from '../../../src/components/Navigation/Navigation';
import Itinerary from '../../../src/components/HomeSection/Itinerary';
import DressCode from '../../../src/components/DressCode/DressCode';
import GiftsSection from '../../../src/components/GiftsSection/GiftsSection';
import { useLanguage } from '../../../src/contexts/LanguageContext';
import styles from '../../../styles/RSVP.module.css';
import homeStyles from '../../../styles/Home.module.css';

const ShapeDivider = () => (
  <div className={homeStyles.shapeDivider}>
     <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z" className={homeStyles.shapeFill}></path>
    </svg>
  </div>
);

const ShapeDividerBottom = () => (
  <div className={homeStyles.shapeDividerBottom}>
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" className={homeStyles.shapeFill}></path>
    </svg>
  </div>
);

const RSVPPage = () => {
  const router = useRouter();
  const { eventId, groupId } = router.query;
  const { messages } = useLanguage();
  
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmedGuests, setConfirmedGuests] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [saveOnOpen, setSaveOnOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [playAudio, setPlayAudio] = useState(false);
  const [audioFallback, setAudioFallback] = useState(false);

  // URL del video de YouTube
  const youtubeUrl = 'https://youtu.be/rF5tJ8xuaIc?t=22';

  // Load group data
  useEffect(() => {
    if (eventId && groupId) {
      loadGroupData();
    }
  }, [eventId, groupId]);

  const loadGroupData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/groups/${groupId}`);
      const data = await response.json();
      
      if (response.ok) {
        // Verificar que el grupo pertenece al evento correcto
        if (data.event_id !== parseInt(eventId)) {
          setError(messages['rsvp.invalidInvitation']);
          return;
        }
        setGroup(data);
        
        // Marcar como abierta la invitación solo si saveOnOpen es true
        if (saveOnOpen) {
          await fetch('/api/groups/open-invitation', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: groupId })
          });
        }
      } else {
        setError(messages['rsvp.invitationNotFound']);
      }
    } catch (error) {
      console.error('Error loading group:', error);
      setError(messages['rsvp.errorLoading']);
    } finally {
      setLoading(false);
    }
  };

  // Marcar como abierta cuando se hace clic en la carta
  useEffect(() => {
    if (saveOnOpen && group) {
      const markAsOpened = async () => {
        await fetch('/api/groups/open-invitation', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: groupId })
        });
      };
      markAsOpened();
    }
  }, [saveOnOpen, group, groupId]);

  // Controlar scroll del body
  useEffect(() => {
    if (!open) {
      document.body.classList.add(styles.noScroll);
    } else {
      document.body.classList.remove(styles.noScroll);
    }
    
    // Cleanup al desmontar el componente
    return () => {
      document.body.classList.remove(styles.noScroll);
    };
  }, [open]);

  const handleConfirm = async () => {
    if (!group || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/groups/confirm-invitation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: groupId,
          confirmed_invitations: confirmedGuests
        })
      });

      if (response.ok) {
        setSubmitted(true);
        // Actualizar el estado del grupo
        setGroup(prev => ({
          ...prev,
          confirmed_status: true,
          deny_status: false,
          confirmed_invitations: confirmedGuests
        }));
      } else {
        setError(messages['rsvp.errorConfirming']);
      }
    } catch (error) {
      console.error('Error confirming:', error);
      setError(messages['rsvp.errorConfirming']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeny = async () => {
    if (!group || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/groups/deny-invitation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: groupId
        })
      });

      if (response.ok) {
        setSubmitted(true);
        // Actualizar el estado del grupo
        setGroup(prev => ({
          ...prev,
          deny_status: true,
          confirmed_status: false
        }));
      } else {
        setError(messages['rsvp.errorDenying']);
      }
    } catch (error) {
      console.error('Error denying:', error);
      setError(messages['rsvp.errorDenying']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLetterClick = () => {
    if (isOpening || open) return;
    
    setIsOpening(true);
    setSaveOnOpen(true);
    
    // Intentar reproducir audio inmediatamente después del click del usuario (iOS requirement)
    try {
      // Crear un contexto de audio si no existe
      if (typeof window !== 'undefined' && window.AudioContext) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
      }
    } catch (e) {
      console.log('AudioContext not available:', e);
    }
    
    // Iniciar reproducción del audio de YouTube
    setPlayAudio(true);
    
    // Si hay problemas con iOS, activar fallback después de un tiempo
    setTimeout(() => {
      if (!audioFallback) {
        // Detectar si es iOS/Safari
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        if (isIOS || isSafari) {
          console.log('Dispositivo iOS/Safari detectado, usando fallback');
          setAudioFallback(true);
        }
      }
    }, 1000);
    
    // Después de 2.5 segundos, ocultar la carta y mostrar el contenido
    setTimeout(() => {
      setOpen(true);
      setIsOpening(false);
    }, 2500);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>{messages['rsvp.loading']}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>{messages['rsvp.error']}</h2>
          <p>{error}</p>
          <button onClick={() => router.push('/')} className={styles.button}>
            {messages['rsvp.backToHome']}
          </button>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>{messages['rsvp.invitationNotFound']}</h2>
          <button onClick={() => router.push('/')} className={styles.button}>
            {messages['rsvp.backToHome']}
          </button>
        </div>
      </div>
    );
  }

  // Siempre mostrar la página completa, solo cambiar la sección RSVP según el estado
  return (
    <>
      <Head>
        <title>Boda de Mer y Juan | 25 de octubre del 2025</title>
        <meta name="description" content="🎉 ¡Ya casi comienza nuestra pato-aventura! 🦆💛 Después de tanto planear, soñar y reír... ¡nos casamos! 💍 Queremos que seas parte de este día tan especial para nosotros. Tu presencia haría nuestra celebración aún más bonita 🌷✨ 📅 25-10-25 📍 Las Nubes, Santiago, Nuevo León" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://meryjuan.dingerbites.com/rsvp/${eventId}/${groupId}`} />
        <meta property="og:title" content="Boda de Mer y Juan | 25 de octubre del 2025" />
        <meta property="og:description" content="🎉 ¡Ya casi comienza nuestra pato-aventura! 🦆💛 Después de tanto planear, soñar y reír... ¡nos casamos! 💍 Queremos que seas parte de este día tan especial para nosotros. Tu presencia haría nuestra celebración aún más bonita 🌷✨ 📅 25-10-25 📍 Las Nubes, Santiago, Nuevo León" />
        <meta property="og:image" content="https://meryjuan.dingerbites.com/images/icon.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Boda de Mer y Juan" />
        <meta property="og:locale" content="es_ES" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://meryjuan.dingerbites.com/rsvp/${eventId}/${groupId}`} />
        <meta property="twitter:title" content="Boda de Mer y Juan | 25 de octubre del 2025" />
        <meta property="twitter:description" content="🎉 ¡Ya casi comienza nuestra pato-aventura! 🦆💛 Después de tanto planear, soñar y reír... ¡nos casamos! 💍 Queremos que seas parte de este día tan especial para nosotros. Tu presencia haría nuestra celebración aún más bonita 🌷✨ 📅 25-10-25 📍 Las Nubes, Santiago, Nuevo León" />
        <meta property="twitter:image" content="https://meryjuan.dingerbites.com/images/icon.jpg" />
        
        {/* Link canonical */}
        <link rel="canonical" href={`https://meryjuan.dingerbites.com/rsvp/${eventId}/${groupId}`} />
      </Head>
      
      <div className={homeStyles.page}>
      {/* ReactPlayer para reproducir audio de YouTube */}
      <ReactPlayer 
        url={youtubeUrl} 
        playing={playAudio && !audioFallback} 
        width='0' 
        height='0'
        volume={0.7}
        muted={false}
        playsinline={true}
        config={{
          youtube: {
            playerVars: { 
              showinfo: 0,
              controls: 0,
              autoplay: 1,
              playsinline: 1,
              rel: 0,
              iv_load_policy: 3
            }
          }
        }}
        onReady={() => {
          // Intentar reproducir cuando esté listo
          if (playAudio) {
            setPlayAudio(false);
            setTimeout(() => setPlayAudio(true), 100);
          }
        }}
        onError={(error) => {
          console.log('Error reproduciendo audio YouTube, usando fallback:', error);
          setAudioFallback(true);
        }}
      />

      {/* Audio fallback para iOS si YouTube falla */}
      {audioFallback && (
        <audio 
          ref={(audio) => {
            if (audio && playAudio) {
              audio.currentTime = 22; // Empezar en el segundo 22
              audio.volume = 0.7;
              audio.play().catch(e => console.log('Error reproduciendo audio fallback:', e));
            }
          }}
          style={{ display: 'none' }}
          preload="auto"
        >
          <source src="https://www.youtube.com/watch?v=rF5tJ8xuaIc" type="audio/mpeg" />
        </audio>
      )}

      {/* Animación de carta que se muestra primero */}
      <div 
        className={`${styles.letterImage} ${open ? styles.hide : ''} ${isOpening ? styles.opening : ''}`}
        onClick={handleLetterClick}
      >
        <p className={styles.title}>{messages['rsvp.invitation.title']}</p>
        <p className={styles.helper}>{messages['rsvp.invitation.helper']}</p>
        <div className={styles.animatedMail}>
          <div className={styles.backFold}></div>
          <div className={styles.letter}>
            <div className={styles.letterBorder}></div>
            <div className={styles.imageWrapper}>
              <Image 
                className={styles.image} 
                src="/images/step4.jpeg" 
                alt="Wedding" 
                width={60}
                height={60}
              />
            </div>
            <div className={styles.letterTitle}></div>
            <div className={styles.letterContext}></div>
            <div className={styles.letterContextBody}>{messages['rsvp.invitation.toWedding']}</div>
            <div className={styles.letterStamp}></div>
          </div>
          <div className={styles.topFold}></div>
          <div className={styles.body}></div>
          <div className={styles.leftFold}></div>
        </div>
        <div className={styles.shadow}></div>
      </div>

      {/* Contenido completo que se muestra después de hacer clic */}
      {open && (
        <>
          {/* Estructura completa de la página de boda */}
          <HomeSection />
          <Navigation />
          <CountdownSection />
          <div className={homeStyles.imageSection}>
            <ShapeDivider />
            <img src="/images/step2.jpeg" alt="step2" className={homeStyles.between} />
            <ShapeDividerBottom />
          </div>
          <MapSection />
          <div className={homeStyles.imageSection}>
            <ShapeDivider />
            <img src="/images/inBetween1.jpeg" alt="inBetween1" className={homeStyles.between} />
            <ShapeDividerBottom />
          </div>
          <Itinerary />
          <div className={homeStyles.imageSection}>
            <ShapeDivider />
            <img src="/images/inBetween2.jpeg" alt="inBetween2" className={homeStyles.between} />
            <ShapeDividerBottom />
          </div>
          <DressCode />
          <div className={homeStyles.imageSection}>
            <ShapeDivider />
            <img src="/images/step3.jpeg" alt="step3" className={homeStyles.between} />
            <ShapeDividerBottom />
          </div>
          <GiftsSection />
          <div className={homeStyles.imageSection}>
            <ShapeDivider />
            <img src="/images/step4.jpeg" alt="step4" className={homeStyles.between} />
            <ShapeDividerBottom />
          </div>
          
          {/* Sección RSVP al final - cambia según el estado */}
          <div id="rsvp" className={styles.rsvpContainer}>
            <h2 className={styles.title}>{messages['rsvp.title']}</h2>
            
            {/* Si ya está confirmado */}
            {group.confirmed_status ? (
              <div className={styles.rsvpForm}>
                <div className={styles.successMessage}>
                  <div className={styles.checkmark}>
                    <img src="/images/confirm.png" alt="Confirmado" />
                  </div>
                  <h3>{messages['rsvp.confirmReceived']}</h3>
                  <p><strong>{messages['rsvp.group']}:</strong> {group.name}</p>
                  <p><strong>{messages['rsvp.confirmedPeople']}:</strong> {group.confirmed_invitations} {messages['rsvp.of']} {group.total_invitations}</p>
                  
                  {group.guests && group.guests.length > 0 && (
                    <div className={styles.guestsList}>
                      <p><strong>{messages['rsvp.groupGuests']}</strong></p>
                      <div className={styles.guestsGrid}>
                        {group.guests.map(guest => (
                          <span key={guest.id} className={styles.guestTag}>{guest.name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p>{messages['rsvp.seeYouThere']}</p>
                  <p><strong>{messages['rsvp.schedule']}</strong></p>
                </div>
              </div>
            ) : group.deny_status ? (
              /* Si ya está rechazado */
              <div className={styles.rsvpForm}>
                <div className={styles.errorMessage}>
                  <div className={styles.checkmark}>
                    <img src="/images/deny.png" alt="Rechazado" />
                  </div>
                  <h3>{messages['rsvp.invitationDenied']}</h3>
                  <p><strong>{messages['rsvp.group']}:</strong> {group.name}</p>
                  <p>{messages['rsvp.sorryCannotAttend']}</p>
                  <p>{messages['rsvp.hopeSeeYouNext']}</p>
                </div>
              </div>
            ) : (
              /* Si no está respondido, mostrar formulario */
              <>
                <h3 className={styles.subtitle}>{messages['rsvp.pleaseConfirm']}</h3>
                
                <div className={styles.groupInfo}>
                  <div className={styles.groupCard}>
                    <h4>{messages['rsvp.group']}: {group.name}</h4>
                    <p>{messages['rsvp.invitationFor']} {group.total_invitations} {group.total_invitations === 1 ? messages['rsvp.person'] : messages['rsvp.people']}</p>
                    
                    {group.guests && group.guests.length > 0 && (
                      <div className={styles.guestsList}>
                        <strong>{messages['rsvp.guests']}</strong>
                        <div className={styles.guestsGrid}>
                          {group.guests.map(guest => (
                            <span key={guest.id} className={styles.guestTag}>{guest.name}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {submitted ? (
                  <div className={styles.successMessage}>
                    <div className={styles.checkmark}>
                      <img src="/images/confirm.png" alt="Confirmado" />
                    </div>
                    <h3>{messages['rsvp.responseSent']}</h3>
                    <p>{messages['rsvp.thankYouConfirm']}</p>
                  </div>
                ) : (
                  <div className={styles.rsvpForm}>
                    <h4>{messages['rsvp.canYouJoin']}</h4>
                    
                    <div className={styles.counterSection}>
                                              <label htmlFor="guestCount">{messages['rsvp.numberOfPeople']}</label>
                      <div className={styles.counter}>
                        <button 
                          type="button"
                          onClick={() => setConfirmedGuests(Math.max(1, confirmedGuests - 1))}
                          disabled={confirmedGuests <= 1}
                          className={styles.counterBtn}
                        >
                          -
                        </button>
                        <input
                          id="guestCount"
                          type="number"
                          min="1"
                          max={group.total_invitations}
                          value={confirmedGuests}
                          onChange={(e) => {
                            const value = Math.min(
                              Math.max(1, parseInt(e.target.value) || 1), 
                              group.total_invitations
                            );
                            setConfirmedGuests(value);
                          }}
                          className={styles.counterInput}
                        />
                        <button 
                          type="button"
                          onClick={() => setConfirmedGuests(Math.min(group.total_invitations, confirmedGuests + 1))}
                          disabled={confirmedGuests >= group.total_invitations}
                          className={styles.counterBtn}
                        >
                          +
                        </button>
                      </div>
                                              <p className={styles.helperText}>
                        {messages['rsvp.minimum']} 1, {messages['rsvp.maximum']} {group.total_invitations} {messages['rsvp.people']}
                      </p>
                    </div>

                    <div className={styles.actions}>
                      <button 
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className={`${styles.actionButton} ${styles.confirmBtn}`}
                      >
                        {isSubmitting ? messages['rsvp.sending'] : `${messages['rsvp.confirm']} ${confirmedGuests} ${confirmedGuests === 1 ? messages['rsvp.person'] : messages['rsvp.confirmPeople']}`}
                      </button>
                      
                      <button 
                        onClick={handleDeny}
                        disabled={isSubmitting}
                        className={`${styles.actionButton} ${styles.denyBtn}`}
                      >
                        {isSubmitting ? messages['rsvp.sending'] : messages['rsvp.cannotAttend']}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
      </div>
    </>
  );
};

export default RSVPPage; 