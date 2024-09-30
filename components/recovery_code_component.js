import React, { useState } from 'react';
import styles from './../styles/SignInEmail.module.css';
import Link from 'next/link';
import axios from 'axios';

const RecoveryCodeComponent = () => {
  const [num, setNum] = useState('');
  const [error, setError] = useState('');

  const handleSendLink = async () => {
    if (!num) {
      setError('Veuillez saisir votre code de récupération :');
      return;
    }

    try {

      const storedRecoveryCode = localStorage.getItem('recoveryCode');
      
      if (!num) {
        setError('Veuillez saisir votre code de récupération :');
        return;
      }

      if (num !== storedRecoveryCode) {
        setError('Code de récupération incorrect.');
        return;
      }
  

      // Rediriger vers la page de confirmation avec le numéro en paramètre
      window.location.href = `/NewPassword`;
   
    } catch (error) {
      if (error.response.status === 401) {
        setError('Numéro de téléphone incorrect ou inexistant');
      }
    }
  };

  return (
    <div className={styles.signInContainer}>
      <div className={styles.signInCard}>
        <div className={styles.rectangle76}></div>
        <div className={styles.signInHeader}>
          <p className={styles.espaceAdmin}>Espace admin</p>
        </div>
        <div className={styles.frame48095631}>
          <div className={styles.frame48095630}>
            <div className={styles.frame48095628}>
              <p className={styles.motDePasse}>Saisissez votre code de  récupération :</p>
              <div className={`${styles.frame77} ${error ? styles.errorBorder : ''}`}>
                <input
                  name='num'
                  type="text"
                  className={styles.telephone}
                  placeholder="XXXXXX"
                  value={num}
                  onChange={(e) => setNum(e.target.value)}
                />
              </div>
              
            </div>
          </div>
        
          <div className={styles.btnBg} onClick={handleSendLink}>
            <p className={styles.text}>Confirmer</p>
          </div>
          </div>
      </div>
    </div>
  );
};

export default RecoveryCodeComponent;
