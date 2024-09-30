import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import styles from '../styles/creerModerateur_interface.module.css';
import { useRouter } from 'next/router';

const CreerModerateurInterface = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nom_mod: '',
    prenom_mod: '',
    numero_telephone_mod: '',
    email: '',
    password: '',
    client_ids: [],
  });

  const [clients, setClients] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/clients/getAllClients', {
          headers: {
            Authorization: `${token}`,
          },
        });
        const availableClients = response.data.filter(client => client.mod_id === null);
        setClients(availableClients);
      } catch (error) {
        console.error('Erreur lors de la récupération des clients :', error);
      }
    };

    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const updatedClientIds = checked
        ? [...formData.client_ids, value]
        : formData.client_ids.filter(id => id !== value);
      setFormData({ ...formData, client_ids: updatedClientIds });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/moderateurs/createModerateur',
        {
          nom_mod: formData.nom_mod,
          prenom_mod: formData.prenom_mod,
          numero_telephone_mod: formData.numero_telephone_mod,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
  
      const moderateurId = response.data.mod_id;
  
      // Mettre à jour le champ mod_id pour chaque client sélectionné
      await Promise.all(
        formData.client_ids.map(client_id =>
          axios.put(
            `http://localhost:8000/clients/updateClient/${client_id}`,
            { mod_id: moderateurId },
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          )
        )
      );
  
      console.log('Modérateur créé:', response.data);
  
      // Notifier le modérateur de sa création de compte
      await axios.post(
        `http://localhost:8000/notifications/moderateur/notifier/${moderateurId}`,
        {
          type_notification: 'Création de compte',
          contenu: 'Votre compte modérateur a été créé avec succès.',
          date_notification: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
  
      // Notifier le modérateur des clients qui lui sont affectés
      await Promise.all(
        formData.client_ids.map(async client_id => {

          const response1 = await axios.get(`http://localhost:8000/clients/getClientById/${client_id}`, {
            headers: {
              Authorization: `${token}`,
            },
          });

          
          await axios.post(
            `http://localhost:8000/notifications/moderateur/notifier/${moderateurId}`,
            {
              type_notification: 'Affectation de client',
              contenu: `Vous avez été affecté en tant que modérateur pour le client ${response1.data.corporation_name}.`,
              date_notification: new Date().toISOString(),
            },
            {
              headers: {
                Authorization: token,
              },
            }
          );
        })
      );
  
      setFormData({
        nom_mod: '',
        prenom_mod: '',
        numero_telephone_mod: '',
        email: '',
        password: '',
        client_ids: [],
      });
  
      router.push('/moderateurs');
    } catch (error) {
      console.error('Erreur lors de la création du modérateur:', error);
    }
  };
  

  return (
    <div className={styles.container}>
      <Component1 />
      <Component2
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        clients={clients}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
      />
    </div>
  );
};

const Component1 = () => {
  return (
    <div className={styles.dashboardInterface}>
      <div className={styles.pageTitle}>
        Pages / Modérateurs / Créer un nouveau modérateur
      </div>
      <div className={styles.statistiques}>Nouveau modérateur</div>
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

const Component2 = ({ formData, handleChange, handleSubmit, clients, showDropdown, setShowDropdown }) => {
  const handleDropdownToggle = () => setShowDropdown(!showDropdown);

  return (
    <div className={styles.frame48095628}>
      <div className={styles.frame1000001842}>
        <div className={styles.frame1000001843}>
          <div className={styles.frame1000001836}>
            <div className={styles.frame10000018371}>
              <div className={styles.frame781}>
                <input type="text" className={styles.nomModerateur} placeholder="Nom du modérateur *" value={formData.nom_mod} onChange={handleChange} name="nom_mod" />
              </div>
              <div className={styles.frame791}>
                <input type="text" className={styles.prenomModerateur} placeholder="Prénom du modérateur *" value={formData.prenom_mod} onChange={handleChange} name="prenom_mod" />
              </div>
            </div>
            <div className={styles.frame1000001839}>
              <div className={styles.frame10000018372}>
                <div className={styles.frame782}>
                  <input type="text" className={styles.numeroTelephone} placeholder="Numéro de téléphone *" value={formData.numero_telephone_mod} onChange={handleChange} name="numero_telephone_mod" />
                </div>
                <div className={styles.frame792}>
                  <input type="text" className={styles.adresseEmail} placeholder="Adresse email *" value={formData.email} onChange={handleChange} name="email" />
                </div>
              </div>
              <div className={styles.frame10000018374}>
                <div className={styles.frame784}>
                  <input type="password" className={styles.motDePasse} placeholder="Attribuer un mot de passe *" value={formData.password} onChange={handleChange} name="password" />
                  <div className={styles.eyeIcon}></div>
                </div>
                <div className={styles.frame794}>
                  <div className={styles.checkboxContainer}>
                    <div className={styles.checkboxTitle} onClick={handleDropdownToggle}>
                      Sélectionner des clients :
                      <span className={styles.dropdownArrow}>{showDropdown ? '▲' : '▼'}</span>
                    </div>
                    {showDropdown && (
                      <div className={styles.dropdownMenu}>
                        {clients.map((client) => (
                          <label key={client.client_id} className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              value={client.client_id}
                            
                              onChange={handleChange}
                              name="client_ids"
                            />
                            {client.corporation_name}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.group1572}>
          <button className={styles.btnBg2} onClick={handleSubmit}>
            <div className={styles.btnText2}>Créer un nouveau modérateur</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreerModerateurInterface;
