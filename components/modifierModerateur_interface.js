import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import styles from '../styles/modifierModerateur_interface.module.css';
import { useRouter } from 'next/router';

const ModifierModerateurInterface = () => {
  const router = useRouter();
  const { userId } = router.query;

  const [formData, setFormData] = useState({
    nom_mod: '',
    prenom_mod: '',
    numero_telephone_mod: '',
    email: '',
    client_ids: [],
  });

  const [clients, setClients] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchModerateur = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/moderateurs/getModerateurById/${userId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        const moderateurId = response.data.mod_id; 


        const moderateurClientsResponse = await axios.get('http://localhost:8000/clients/getAllClients', {
          headers: {
            Authorization: `${token}`,
          },
        });

        const moderateurClients = moderateurClientsResponse.data.filter(client => client.mod_id === moderateurId);
   
        const clientIds = moderateurClients.map(client => client.client_id);

        setFormData({
          ...response.data,
          client_ids: clientIds, // Set client_ids as the IDs of the moderator's clients
        });

        // Fetch available clients (mod_id === null) and moderator's clients
        const availableClients = moderateurClientsResponse.data.filter(
          client => client.mod_id === null || client.mod_id === moderateurId
        );
        setClients(availableClients);
      } catch (error) {
        console.error('Erreur lors de la récupération du modérateur :', error);
      }
    };

    if (userId) {
      fetchModerateur();
    }
  }, [userId]);

  const handleChange = async (e, clientId) => {
    const { name, value, checked } = e.target;
    try {
      const token = localStorage.getItem('token');
      if (name === 'client_ids') {
        const response = await axios.put(
          `http://localhost:8000/clients/updateClient/${clientId}`,
          { mod_id: checked ? userId : null }, // Update mod_id based on checked state
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
  
        console.log(`Updated mod_id for client ${clientId}:`, response.data);
  
        const updatedClientIds = checked
          ? [...formData.client_ids, clientId]
          : formData.client_ids.filter(id => id !== clientId);
  
        setFormData({ ...formData, client_ids: updatedClientIds });
  
        const response1 = await axios.get(`http://localhost:8000/clients/getClientById/${clientId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        // Notify the moderator of client assignment or removal
        const notificationContent = checked
          ? `Vous avez été affecté en tant que modérateur pour le client ${response1.data.corporation_name}.`
          : `Vous avez été retiré en tant que modérateur pour le client ${response1.data.corporation_name}.`;
  
        await axios.post(
          `http://localhost:8000/notifications/moderateur/notifier/${userId}`,
          {
            type_notification: 'Modification de clients',
            contenu: notificationContent,
            date_notification: new Date().toISOString(),
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } else {
        // Handle other input fields
        setFormData({ ...formData, [name]: value });
      }
    } catch (error) {
      console.error(`Error updating mod_id for client ${clientId}:`, error);
    }
  };
  
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/moderateurs/updateModerateur/${userId}`,
        {
          nom_mod: formData.nom_mod,
          prenom_mod: formData.prenom_mod,
          numero_telephone_mod: formData.numero_telephone_mod,
          email: formData.email,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
  
      // Update the mod_id for each selected client
      await Promise.all(
        formData.client_ids.map(client_id =>
          axios.put(
            `http://localhost:8000/clients/updateClient/${client_id}`,
            { mod_id: userId },
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          )
        )
      );
  
      console.log('Modérateur mis à jour :', response.data);

  
      // Notify the moderator of profile update
      await axios.post(
        `http://localhost:8000/notifications/moderateur/notifier/${userId}`,
        {
          type_notification: 'Mise à jour de profil',
          contenu: 'Votre profil de modérateur a été mis à jour avec succès.',
          date_notification: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
  
      router.push('/moderateurs');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du modérateur :', error);
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
        Pages / Modérateurs / Modifier un profil modérateur
      </div>
      <div className={styles.statistiques}>Modifier le compte modérateur</div>
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
                <div className={styles.frame794}>
                  <div className={styles.checkboxContainer}>
                    <div className={styles.checkboxTitle} onClick={handleDropdownToggle}>
                      Clients assignés au modérateur :
                      <span className={styles.dropdownArrow}>{showDropdown ? '▲' : '▼'}</span>
                    </div>
                    {showDropdown && (
                      <div className={styles.dropdownMenu}>
                        {clients.map((  client) => (
                          <label key={client.client_id} className={styles.checkboxLabel}>
                            {client.mod_id !== null ? ( // For clients with non-null mod_id
                              <input
                              type="checkbox"
                              value={client.client_id}
                              checked={formData.client_ids.includes(client.client_id)}
                              onChange={(e) => handleChange(e, client.client_id)} // Pass client.client_id to handleChange
                              name="client_ids"
                            />
                            ) : ( // For clients with null mod_id
                              <input
                                type="checkbox"
                                value={client.client_id}
                                checked={formData.client_ids.includes(client.client_id)}
                                onChange={(e) => handleChange(e, client.client_id)} // Pass client.client_id to handleChange
                                name="client_ids"
                              />
                            )}
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
            <div className={styles.btnText2}>Enregistrer les changements</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifierModerateurInterface;
