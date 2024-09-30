import React,{ useState } from 'react';
import styles from './../styles/confirmer_mdp_box.module.css';
import Link from 'next/link';

const ConfirmerMdp = () => {
  const [password, setPassword] = useState('');
  const [ConfirmerPassword, setConfirmerPassword] = useState('');
  const [notIdenticalPassword] = useState(false); // Initialize notIdenticalPassword state

  return (
    <div className={styles.ConfirmerPasswordContainer}>
      {/* Confirmer Password Card */}
      <div className={styles.ConfirmerPasswordCard}>
        {/* Rectangle 76 */}
        <div className={styles.rectangle76}></div>

        {/* Confirmer Password Header */}
        <div className={styles.ConfirmerPasswordHeader}>
          <p className={styles.CompteVerifie}>Compte vérifié !</p>
        </div>

        {/* Frame 48095631 */}
        <div className={styles.frame48095631}>
          {/* Frame 48095630 */}
          <div className={styles.frame48095630}>
            {/* Frame 48095628 */}
            <div className={styles.frame48095628}>
              {/* Frame 77 */}
              <div className={styles.frame77}>
                {/* password */}
                <input
                    name='password'
                    type="password"
                    className={styles.password}
                    placeholder="Nouveau mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Frame 78 */}
              <div className={`${styles.frame78} ${notIdenticalPassword ? styles.errorBorder : ''}`}>
                {/* Mot de passe */}
                <input
                    name='ConfirmerPassword'
                    type="password"
                    className={styles.motDePasse}
                    placeholder="Confirmer le mot de passe"
                    value={ConfirmerPassword}
                    onChange={(e) => setConfirmerPassword(e.target.value)}
                />
                {notIdenticalPassword && <p className={styles.errorMessage}>Les deux mots de passe ne sont pas identiques</p>}
                {/* solar:eye-linear */}
                <div className={styles.solarEyeLinear}></div>
              </div>
            </div>

                 
          </div>

          {/* Btn Bg */}
          <Link href="./mdp_change" className={styles.btnBg}>
          {/* Text */}
             <p className={styles.text}>Changer le mot de passe</p>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default ConfirmerMdp;
