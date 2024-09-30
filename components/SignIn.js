import React, { useState } from 'react';
import styles from './../styles/SignIn.module.css';
import Link from 'next/link';
import axios from 'axios';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        email,
        password
      });
      const { token,userId,role } = response.data;

      if (!role) {
        setError('Impossible de récupérer le rôle de l\'utilisateur');
        return;
      }

      
      if (role === 'admin') {
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);
      window.location.href = '/dashboard';
      } else {
        setError('Vous devez être un administrateur pour accéder à cet espace');
      }
    } catch (error) {
      if (error.response.status === 401) {
        setError('Email ou mot de passe incorrect');
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
              <div className={`${styles.frame78} ${error ? styles.errorBorder : ''}`}>
                <input
                  name='password'
                  type="password"
                  className={styles.motDePasse}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className={styles.errorMessage2}>{error}</p>}
              </div>
            </div>
          </div>
          <div className={styles.frame48095629}>
            <div className={styles.flexrow}>
              <input type="checkbox" id="checkboxInput" className={styles.checkboxInput} />
              <label htmlFor="checkboxInput" className={styles.checkboxButton}>
                <svg className={styles.checkmarkIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17l-5-5" fill="none" stroke="#54B848" strokeWidth="2" />
                </svg>
              </label>
              <label htmlFor="checkboxInput" className={styles.seSouvenirDeMoi}>Se souvenir de moi</label>
            </div>
          </div>
          <div className={styles.btnBg} onClick={handleSignIn}>
            <p className={styles.text}>Se connecter</p>
          </div>
          <p className={styles.motDePasseOublie}>Mot de passe oublié? <Link href="/methode_recuperation">Récupérer mot de passe</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
