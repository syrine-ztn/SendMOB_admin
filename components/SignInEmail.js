import React, { useState } from 'react';
import styles from './../styles/SignInEmail.module.css';
import Link from 'next/link';
import axios from 'axios';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSendLink = async () => {
    if (!email) {
      setError('Veuillez saisir votre adresse e-mail');
      return;
    }

    try {

      let link="http://localhost:3000/NewPassword";
      const response = await axios.post('http://localhost:8000/auth/recupererMotDePasse', {
        email,link
      });
      //const { token,userId,role } = response.data;

     

      
     // Rediriger vers la page de confirmation avec l'email en paramètre
     window.location.href = `/recuperer_mdp?email=${encodeURIComponent(email)}`;
   
    } catch (error) {
      if (error.response.status === 401) {
        setError('Email incorrect ou inexistant');
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
              <p className={styles.motDePasse}>Saisissez votre adresse e-mail de  récupération :</p>
              <div className={`${styles.frame77} ${error ? styles.errorBorder : ''}`}>
                <input
                  name='email'
                  type="text"
                  className={styles.emailUsername}
                  placeholder="abc@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
