import React, { useState } from 'react';
import styles from './../styles/SignInEmail.module.css';
import Link from 'next/link';
import axios from 'axios';

const SignIn = () => {
  const [num, setNum] = useState('');
  const [error, setError] = useState('');

  const handleSendLink = async () => {
    if (!num) {
      setError('Veuillez saisir votre Numéro de téléphone :');
      return;
    }

    try {

      let recipientPhoneNumber = num;
      // Générer un code de récupération aléatoire
      const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
      const message = `Votre code de récupération est : ${recoveryCode}`;

      // Envoyer le code de récupération par SMS
      const response = await axios.post('http://localhost:8000/envoiSMS2/sendPwd', {
        recipientPhoneNumber,
        message
      });

      // Stocker le code de récupération (par exemple, dans le localStorage)
      localStorage.setItem('recoveryCode', recoveryCode);

      // Rediriger vers la page de confirmation avec le numéro en paramètre
      window.location.href = `/recovery_code`;
   
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
              <p className={styles.motDePasse}>Saisissez votre numéro de téléphone de  récupération :</p>
              <div className={`${styles.frame77} ${error ? styles.errorBorder : ''}`}>
                <input
                  name='num'
                  type="text"
                  className={styles.telephone}
                  placeholder="+213 XXX XXX XXX OU 0XXX XXX XXX"
                  value={num}
                  onChange={(e) => setNum(e.target.value)}
                />
              </div>
              
            </div>
          </div>
        
          <div className={styles.btnBg} onClick={handleSendLink}>
            <p className={styles.text}>Envoyer le lien</p>
          </div>
          </div>
      </div>
    </div>
  );
};

export default SignIn;
