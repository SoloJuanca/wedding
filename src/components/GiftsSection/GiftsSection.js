import React, { useState } from 'react';
import styles from './GiftsSection.module.css';

const GiftsSection = () => {
  const [copiedAccount, setCopiedAccount] = useState('');
  const [copiedClabe, setCopiedClabe] = useState('');

  const accountNumber = '4152314047213247'; // Reemplaza con el número real
  const clabeNumber = '012580015183469799'; // Reemplaza con la CLABE real

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'account') {
        setCopiedAccount('¡Copiado!');
        setTimeout(() => setCopiedAccount(''), 2000);
      } else if (type === 'clabe') {
        setCopiedClabe('¡Copiado!');
        setTimeout(() => setCopiedClabe(''), 2000);
      }
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div id="gifts" className={styles.giftsContainer}>
      <h2 className={styles.title}>Mesa de Regalos</h2>
      <h3 className={styles.subtitle}>Tu presencia es nuestro mejor regalo</h3>
      
      <div className={styles.optionsContainer}>
        {/* Mesa de Regalos Liverpool */}
        <div className={styles.giftOption}>
          <div className={styles.optionHeader}>
            <div className={styles.icon}>
              <img src="/images/gift.png" alt="Mesa de Regalos Liverpool" />
            </div>
            <h4 className={styles.optionTitle}>Mesa de Regalos Virtual</h4>
          </div>
          <p className={styles.optionDescription}>
            Visita nuestra mesa de regalos en Liverpool
          </p>
          <a 
            href="https://mesaderegalos.liverpool.com.mx/milistaderegalos/51555722" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.liverpoolButton}
          >
            Ver Mesa de Regalos
          </a>
        </div>

        {/* Transferencia Bancaria */}
        <div className={styles.giftOption}>
          <div className={styles.optionHeader}>
            <div className={styles.icon}>
              <img src="/images/card.png" alt="BBVA" />
            </div>
            <h4 className={styles.optionTitle}>Transferencia Bancaria</h4>
          </div>
          <p className={styles.optionDescription}>
            También puedes hacer una transferencia directa
          </p>
          
          <div className={styles.bankDetails}>
            <div className={styles.bankField}>
              <label>Banco:</label>
              <span>BBVA México</span>
            </div>
            
            <div className={styles.bankField}>
              <label>Número de tarjeta:</label>
              <div className={styles.copyContainer}>
                <span className={styles.accountNumber}>{accountNumber}</span>
                <button 
                  onClick={() => copyToClipboard(accountNumber, 'account')}
                  className={styles.copyButton}
                  title="Copiar número de tarjeta"
                >
                  {copiedAccount || '📋'}
                </button>
              </div>
            </div>

            <div className={styles.bankField}>
              <label>CLABE:</label>
              <div className={styles.copyContainer}>
                <span className={styles.accountNumber}>{clabeNumber}</span>
                <button 
                  onClick={() => copyToClipboard(clabeNumber, 'clabe')}
                  className={styles.copyButton}
                  title="Copiar CLABE"
                >
                  {copiedClabe || '📋'}
                </button>
              </div>
            </div>

            <div className={styles.referenceNote}>
              <strong>Importante:</strong> Por favor incluye como referencia o comentario: 
              <span className={styles.referenceText}>"Ahorro o Regalo"</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftsSection; 