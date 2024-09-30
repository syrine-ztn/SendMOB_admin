import React from 'react';
import styles from './../styles/methode_recuperation_box.module.css';
import Link from 'next/link';

const methode_recuperation_box = () => {

  return (
    <div className={styles.recupererContainer}>
      {/* recuperer Card */}
      <div className={styles.recupererCard}>
        {/* Rectangle 76 */}
        <div className={styles.rectangle76}></div>

        {/* recuperer Header */}
        <div className={styles.recupererHeader}>
          <p className={styles.recupererHeaderText}>Récupérer mot de passe</p>
        </div>

        {/* Frame 48095631 */}
        <div className={styles.frame48095631}>
        <p className={styles.recupererText}>Choisissez votre méthode de récupération du mot de passe</p>

        <div className={styles.email}></div>
        <p className={styles.renvoyerLien}>Récupération via <Link href="/Email_mdp">l'envoi d'un lien à votre adresse e-mail</Link></p>
        <div className={styles.phone}></div>
        <p className={styles.renvoyerLien2}>Récupération par <Link href="/Tel_mdp">l'envoi d'un code à votre numéro de téléphone</Link></p>
        </div>
      </div>
    </div>
  );
};

export default methode_recuperation_box;
