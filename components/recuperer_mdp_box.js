import React, { useState, useEffect } from 'react';
import styles from './../styles/recuperer_mdp_box.module.css';
import Link from 'next/link';
import axios from 'axios';

const RecupererMdpBox = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleSendLink = async () => {
    try {
      let link = "http://localhost:3000/NewPassword";
      await axios.post('http://localhost:8000/auth/recupererMotDePasse', {
        email,
        link
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Email incorrect ou inexistant');
      }
    }
  };

  return (
    <div className={styles.recupererContainer}>
      <div className={styles.recupererCard}>
        <div className={styles.rectangle76}></div>
        <div className={styles.recupererHeader}>
          <p className={styles.recupererHeaderText}>Récupérer mot de passe</p>
        </div>
        <div className={styles.frame48095631}>
          <p className={styles.recupererText}>Cliquez sur le lien envoyé à votre adresse e-mail pour vérifier votre compte.</p>
          <p className={styles.renvoyerLien}>
            Vous n'avez pas reçu le lien ? <span onClick={handleSendLink} style={{ cursor: 'pointer', textDecoration: 'none' }}>Renvoyer le lien.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecupererMdpBox;
