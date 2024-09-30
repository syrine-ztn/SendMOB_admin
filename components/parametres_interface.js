import React, { useState, useEffect } from 'react';
import styles from '../styles/parametres_interface.module.css';
import Link from 'next/link';
import axios from 'axios';

const ParametresInterface = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    numero_telephone: '',
    email: '',
    ancien_mot_de_passe: '',
    nouveau_mot_de_passe: '',
  });

  useEffect(() => {
    const getAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/admins/getAdminById', {
          headers: {
            Authorization: `${token}`,
          },
        });
        const adminData = response.data;
        setFormData({
          nom: adminData.nom,
          prenom: adminData.prenom,
          numero_telephone: adminData.numero_telephone,
          email: adminData.email,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des informations de l\'administrateur:', error);
      }
    };

    getAdminData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const modifyAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:8000/admins/updateAdmin',
        { ...formData, password: formData.nouveau_mot_de_passe }, // Setting the new password to the 'password' field
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log('Profil admin mis à jour:', response.data);
      // Réinitialiser le formulaire après la mise à jour du profil
      setFormData({
        ...formData,
        ancien_mot_de_passe: '',
        nouveau_mot_de_passe: '',
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil admin:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Component1 />
      <Component2 formData={formData} handleChange={handleChange} modifyAccount={modifyAccount} />
    </div>
  );
};

const Component1 = () => {
  return ( 
    <div className={styles.dashboardInterface}>
      <div className={styles.pageTitle}>Pages / Paramètres</div>
      <div className={styles.statistiques}>Modification du compte</div>
      <div className={styles.misc}>
        <div className={styles.rectangle356}>
          <div className={styles.searchContainer}>
            <div className={styles.largeInput}>
              <div className={styles.background}></div>
              <div className={styles.searchIcon}>
                <div className={styles.ellipse6}></div>
                <div className={styles.line1}></div>
                <input className={styles.text} type="text" placeholder="Recherche" />
              </div>
            </div>
            <div className={styles.notificationsIcon}>
              <div className={styles.vector}></div>
              <div className={styles.notification}></div>
              <div className={styles.notificationStyle}>
                <Link href="/notifications" className={styles.notificationLink}></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Component2 = ({ formData, handleChange, modifyAccount }) => {
  return (
    <div className={styles.frame48095628}>
      <div className={styles.frame1000001842}>
        <div className={styles.frame1000001843}>
          <div className={styles.frame1000001836}>
            <div className={styles.frame10000018371}>
              <div className={styles.frame781}>
                <input type="text" className={styles.nom} placeholder="Nom *" value={formData.nom} onChange={handleChange} name="nom" />
              </div>
              <div className={styles.frame791}>
                <input type="text" className={styles.prenom} placeholder="Prénom *" value={formData.prenom} onChange={handleChange} name="prenom" />
              </div>
            </div>
            <div className={styles.frame1000001839}>
              <div className={styles.frame10000018372}>
                <div className={styles.frame782}>
                  <input type="text" className={styles.phoneNumber} placeholder="Numéro de téléphone *" value={formData.numero_telephone} onChange={handleChange} name="numero_telephone" />
                </div>
                <div className={styles.frame792}>
                  <input type="email" className={styles.email} placeholder="Adresse email *" value={formData.email} onChange={handleChange} name="email" />
                </div>
              </div>
              <div className={styles.group1571}>
                <button className={styles.btnBg1} onClick={modifyAccount}>
                  <div className={styles.btnText1}>Enregistrer les modifications</div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.frame1000001844}>
          <div className={styles.passwordModification}>Modification du mot de passe</div>
          <div className={styles.frame1000001840}>
            <div className={styles.frame10000018373}>
              <div className={styles.frame783}>
                <input type="password" className={styles.oldPassword} placeholder="Ancien mot de passe *" value={formData.ancien_mot_de_passe} onChange={handleChange} name="ancien_mot_de_passe" />
                <div className={styles.eyeIcon}></div>
              </div>
              <div className={styles.frame80}>
                <input type="password" className={styles.newPassword} placeholder="Nouveau mot de passe *" value={formData.nouveau_mot_de_passe} onChange={handleChange} name="nouveau_mot_de_passe" />
                <div className={styles.eyeIcon}></div>
              </div>
            </div>
            <div className={styles.group1572}>
              <button className={styles.btnBg2} onClick={modifyAccount}>
                <div className={styles.btnText2}>Changer le mot de passe</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametresInterface;
