import React from 'react';
import styles from '../styles/menu_moderateurs.module.css';
import Link from 'next/link';

const MenuModerateurs = () => {

  const handleLogout = () => {
    // Supprimer le token JWT du stockage local
    localStorage.removeItem('token');
    // Rediriger vers la page de connexion
    window.location.href = '/';
  };

  return (
    <div className={styles.frame66}>
      {/* Group 155 */}
      <div className={styles.group155}>
        {/* Frame 65 */}
        <div className={styles.frame65}>
          {/* SendMOB */}
          <div className={styles.sendMOB}></div>

          {/* Image 1 */}
          <div className={styles.image1}></div>

          {/* Frame 58 */}
          <div className={styles.frame58}>
            {/* Frame 64 */}
            <div className={styles.frame64}>
              {/* Frame 56 */}
              <div className={styles.frame56}>
                {/* Icon */}
                <div className={styles.icon}></div>

                {/* Vector */}
                <div className={styles.vector}></div>

                {/* Pagetitle */}
                <div className={styles.pageTitle1}>Send<b>MOB</b></div>
              </div>
              
              {/* Frame 57 */}
              <Link href="/dashboard" className={styles.frame57}>
                {/* heroicons:users-solid */}
                <div className={styles.heroicons}></div>

                {/* Vector */}
                <div className={styles.vector}></div>

                {/* Pagetitle */}
                <div className={styles.pageTitle2}>Dashboard</div>
              </Link>

              {/* Frame 58 */}
              <Link href="/clients" className={styles.frame58}>
                <div className={styles.clients}></div>  
                <div></div>
                <div className={styles.pageTitle3}>Clients</div>
              </Link>

              {/* Frame 59 */}
              <Link href="/moderateurs" className={styles.frame59}>
                {/* solar:wallet-money-bold */}
                <div className={styles.moderateurs}></div>

                {/* Group 39409 */}
                <div>
                </div>

                {/* Pagetitle */}
                <div className={styles.pageTitle4}>Modérateurs</div>
              </Link>

              {/* Frame 61 */}
              <Link href="/plans" className={styles.frame61}>
                {/* material-symbols:warning-rounded */}
                <div className={styles.materialSymbols}></div>

                {/* Vector */}
                <div></div>

                {/* Pagetitle */}
                <div className={styles.pageTitle5}>Abonnements</div>
              </Link>

              {/* Frame 62 */}
              <Link href="/signalements" className={styles.frame62}>
                {/* ant-design:setting-filled */}
                <div className={styles.antDesign}></div>

                {/* Vector */}
                <div></div>

                {/* Pagetitle */}
                <div className={styles.pageTitle6}>Signalements</div>
              </Link>

              {/* Frame 63 */}
              <Link href="/parametres" className={styles.frame63}>
                {/* solar:logout-3-bold */}
                <div className={styles.solar}></div>

                <div></div>

                {/* Pagetitle */}
                <div className={styles.pageTitle7}>Paramètres</div>
              </Link>

              <Link href="/" className={styles.deconnecter} onClick={handleLogout}>
                {/* solar:logout-3-bold */}
                <div className={styles.iconDeconnecter}></div>

                <div></div>

                {/* Pagetitle */}
                <div className={styles.pageTitle8}>Se déconnecter</div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Frame 68 */}
      <Link href="#" className={styles.frame68}>
        {/* Active */}
        <div className={styles.active}></div>

        {/* Active */}
        <div className={styles.active}></div>
      </Link>
    </div>
  );
};

export default MenuModerateurs;
