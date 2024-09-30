import React,{ useState } from 'react';
import styles from './../styles/mdp_change_box.module.css';
import Link from 'next/link';

const mdp_change_box = () => {

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
        <p className={styles.mdpChangeText}>Mot de passe changé avec succès !<br /><br />Vous pouvez maintenant vous connectez avec votre nouveau mot de passe.</p>

        {/* Btn Retour */}
        <Link href="/" className={styles.btnRetour}>
          {/* Text */}
             <p className={styles.text}>Retourner vers la page de connexion</p>
        </Link>

        </div>
      </div>
    </div>
  );
};

export default mdp_change_box;
