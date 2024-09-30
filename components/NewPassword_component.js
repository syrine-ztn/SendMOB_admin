import React, { useState } from 'react';
import styles from './../styles/NewPassword.module.css';
import Link from 'next/link';
import axios from 'axios';

const NewPasswordComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ancienPwd, setAncienPwd] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    // Vérification des champs vides
    if (!email || !password || !ancienPwd) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    // Vérification de la correspondance des mots de passe
    if (password !== ancienPwd) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Réinitialiser le message d'erreur
    setError('');

    try {
      const response = await axios.put('http://localhost:8000/admins/updateAdminPwd', {
        email,
        password
      });

      // Rediriger vers la page d'accueil après succès
      window.location.href = '/';

    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Email incorrect');
      } else {
        setError('Une erreur est survenue, veuillez réessayer');
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
              <div className={`${styles.frame77} ${error ? styles.errorBorder : ''}`}>
                <input
                  name='email'
                  type="text"
                  className={styles.emailUsername}
                  placeholder="Email ou nom d'utilisateur"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={`${styles.frame77} ${error ? styles.errorBorder : ''}`}>
                <input
                  name='ancienPwd'
                  type="password"
                  className={styles.motDePasse}
                  placeholder="Nouveau mot de passe"
                  value={ancienPwd}
                  onChange={(e) => setAncienPwd(e.target.value)}
                />
              </div>
              <div className={`${styles.frame78} ${error ? styles.errorBorder : ''}`}>
                <input
                  name='password'
                  type="password"
                  className={styles.motDePasse}
                  placeholder="Confirmation du nouveau mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className={styles.errorMessage2}>{error}</p>}
              </div>
            </div>
          </div>
      
          <div className={styles.btnBg} onClick={handleSignIn}>
            <p className={styles.text}>Enregistrer</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default NewPasswordComponent;
