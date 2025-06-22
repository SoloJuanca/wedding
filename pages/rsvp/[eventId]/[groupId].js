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
          setError('Invitación no válida para este evento');
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
        setError('Invitación no encontrada');
      }
    } catch (error) {
      console.error('Error loading group:', error);
      setError('Error al cargar la invitación');
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
        setError('Error al confirmar la invitación');
      }
    } catch (error) {
      console.error('Error confirming:', error);
      setError('Error al confirmar la invitación');
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
        setError('Error al rechazar la invitación');
      }
    } catch (error) {
      console.error('Error denying:', error);
      setError('Error al rechazar la invitación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLetterClick = () => {
    if (isOpening || open) return;
    
    setIsOpening(true);
    setSaveOnOpen(true);
    
    // Iniciar reproducción del audio de YouTube
    setPlayAudio(true);
    
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
          <p>Cargando invitación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => router.push('/')} className={styles.button}>
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Invitación no encontrada</h2>
          <button onClick={() => router.push('/')} className={styles.button}>
            Volver al Inicio
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
        <meta name="description" content={`Te invitamos a celebrar nuestra boda. Confirmación para ${group.name} - ¡Acompáñanos en este día tan especial!`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://meryjuan.dingerbites.com/rsvp/${eventId}/${groupId}`} />
        <meta property="og:title" content="Boda de Mer y Juan | 25 de octubre del 2025" />
        <meta property="og:description" content={`Te invitamos a celebrar nuestra boda. Confirmación para ${group.name} - ¡Acompáñanos en este día tan especial!`} />
        <meta property="og:image" content="https://meryjuan.dingerbites.com/images/icon.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Boda de Mer y Juan" />
        <meta property="og:locale" content="es_ES" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://meryjuan.dingerbites.com/rsvp/${eventId}/${groupId}`} />
        <meta property="twitter:title" content="Boda de Mer y Juan | 25 de octubre del 2025" />
        <meta property="twitter:description" content={`Te invitamos a celebrar nuestra boda. Confirmación para ${group.name} - ¡Acompáñanos en este día tan especial!`} />
        <meta property="twitter:image" content="https://meryjuan.dingerbites.com/images/icon.jpg" />
        
        {/* Link canonical */}
        <link rel="canonical" href={`https://meryjuan.dingerbites.com/rsvp/${eventId}/${groupId}`} />
      </Head>
      
      <div className={homeStyles.page}>
      {/* ReactPlayer para reproducir audio de YouTube */}
      <ReactPlayer 
        url={youtubeUrl} 
        playing={playAudio} 
        width='0' 
        height='0'
        volume={0.7}
        config={{
          youtube: {
            playerVars: { showinfo: 0 }
          }
        }}
      />

      {/* Animación de carta que se muestra primero */}
      <div 
        className={`${styles.letterImage} ${open ? styles.hide : ''} ${isOpening ? styles.opening : ''}`}
        onClick={handleLetterClick}
      >
        <p className={styles.title}>Te invitamos a...</p>
        <p className={styles.helper}>Clickeame</p>
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
            <div className={styles.letterContextBody}>A nuestra boda</div>
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
            <h2 className={styles.title}>RSVP - Confirmación de Asistencia</h2>
            
            {/* Si ya está confirmado */}
            {group.confirmed_status ? (
              <div className={styles.rsvpForm}>
                <div className={styles.successMessage}>
                  <div className={styles.checkmark}>
                    <img src="/images/confirm.png" alt="Confirmado" />
                  </div>
                  <h3>¡Confirmación Recibida!</h3>
                  <p><strong>Grupo:</strong> {group.name}</p>
                  <p><strong>Personas confirmadas:</strong> {group.confirmed_invitations} de {group.total_invitations}</p>
                  
                  {group.guests && group.guests.length > 0 && (
                    <div className={styles.guestsList}>
                      <p><strong>Invitados del grupo:</strong></p>
                      <div className={styles.guestsGrid}>
                        {group.guests.map(guest => (
                          <span key={guest.id} className={styles.guestTag}>{guest.name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p>¡Nos vemos el 25 de octubre de 2025!</p>
                  <p><strong>Horario:</strong> 6:00 PM - Boda Civil | 7:00 PM - Ceremonia Religiosa | 8:00 PM - Recepción</p>
                </div>
              </div>
            ) : group.deny_status ? (
              /* Si ya está rechazado */
              <div className={styles.rsvpForm}>
                <div className={styles.errorMessage}>
                  <div className={styles.checkmark}>
                    <img src="/images/deny.png" alt="Rechazado" />
                  </div>
                  <h3>Invitación Rechazada</h3>
                  <p><strong>Grupo:</strong> {group.name}</p>
                  <p>Lamentamos que no puedan acompañarnos en este día tan especial.</p>
                  <p>¡Esperamos verlos en otra ocasión!</p>
                </div>
              </div>
            ) : (
              /* Si no está respondido, mostrar formulario */
              <>
                <h3 className={styles.subtitle}>Por favor confirma tu asistencia</h3>
                
                <div className={styles.groupInfo}>
                  <div className={styles.groupCard}>
                    <h4>Grupo: {group.name}</h4>
                    <p>Invitación para hasta {group.total_invitations} {group.total_invitations === 1 ? 'persona' : 'personas'}</p>
                    
                    {group.guests && group.guests.length > 0 && (
                      <div className={styles.guestsList}>
                        <strong>Invitados:</strong>
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
                    <h3>¡Respuesta Enviada!</h3>
                    <p>Gracias por confirmar tu asistencia. Nos vemos en la celebración.</p>
                  </div>
                ) : (
                  <div className={styles.rsvpForm}>
                    <h4>¿Podrán acompañarnos?</h4>
                    
                    <div className={styles.counterSection}>
                      <label htmlFor="guestCount">Número de personas que asistirán:</label>
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
                        Mínimo 1, máximo {group.total_invitations} personas
                      </p>
                    </div>

                    <div className={styles.actions}>
                      <button 
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className={`${styles.actionButton} ${styles.confirmBtn}`}
                      >
                        {isSubmitting ? 'Enviando...' : `Confirmar ${confirmedGuests} ${confirmedGuests === 1 ? 'persona' : 'personas'}`}
                      </button>
                      
                      <button 
                        onClick={handleDeny}
                        disabled={isSubmitting}
                        className={`${styles.actionButton} ${styles.denyBtn}`}
                      >
                        {isSubmitting ? 'Enviando...' : 'No podré asistir'}
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