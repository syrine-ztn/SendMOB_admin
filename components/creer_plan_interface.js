import React, { useState, useEffect } from 'react';
import styles from '../styles/creer_plan_interface.module.css';
import Link from 'next/link';
import axios from 'axios';

const CreerPlanInterface = () => {
  const [nomValue, setNomValue] = useState('');
  const [tarificationValue, setTarificationValue] = useState('');
  const [nombreMessageValue, setNombreMessageValue] = useState('');
  const [dureeValue, setDureeValue] = useState('');
  const [choixClientValue, setChoixClientValue] = useState('');
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/clients/getAllClients', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setClients(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des clients :', error);
      }
    };

    fetchClients();
  }, []);

  const AjouterPlan = async () => {
    try {
      const token = localStorage.getItem('token');

      const planData = {
        nom_plan: nomValue,
        prix: tarificationValue,
        duree: dureeValue,
        nombre_message: nombreMessageValue,
        client_id: choixClientValue,
      };
      

      const response = await axios.post('http://localhost:8000/plans/createPlan', planData, {
        headers: {
          Authorization: `${token}`,
        },
      });


      
      const response1 = await axios.get(`http://localhost:8000/clients/getClientById/${planData.client_id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });


      // Extraire le corporation_name du client sélectionné
      const corporationName = response1.data.corporation_name;

     if (response1.data.mod_id) {
     // Notifier
     await axios.post(
      `http://localhost:8000/notifications/moderateur/notifier/${response1.data.mod_id}`,
      {
        type_notification: 'Création de plan',
        contenu: `Le plan ${planData.nom_plan} pour le client ${corporationName} a été créé.`,
        date_notification: new Date().toISOString(),
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
   }

    // Notifier le client
    await axios.post(
      `http://localhost:8000/notifications/notifier/${planData.client_id}`,
      {
        type_notification: 'Création de plan',
        contenu: `Votre plan ${planData.nom_plan} a été créé avec succès.`,
        date_notification: new Date().toISOString(),
        client_id: planData.client_id,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );


      window.location.href = '/plans';
      console.log('Plan créé:', response.data);
    } catch (error) {
      console.error('Erreur lors de la création du plan:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Component1 />
      <Component2
        nomValue={nomValue}
        setNomValue={setNomValue}
        tarificationValue={tarificationValue}
        setTarificationValue={setTarificationValue}
        nombreMessageValue={nombreMessageValue}
        setNombreMessageValue={setNombreMessageValue}
        dureeValue={dureeValue}
        setDureeValue={setDureeValue}
        choixClientValue={choixClientValue}
        setChoixClientValue={setChoixClientValue}
        AjouterPlan={AjouterPlan}
        clients={clients}
      />
    </div>
  );
};

const Component1 = () => {
  return (
    <div className={styles.dashboardInterface}>
      <div className={styles.pageTitle}>Pages / Plans / Créer un nouveau plan</div>
      <div className={styles.statistiques}>Créer un nouveau plan</div>
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

const Component2 = ({
  nomValue,
  setNomValue,
  tarificationValue,
  setTarificationValue,
  nombreMessageValue,
  setNombreMessageValue,
  dureeValue,
  setDureeValue,
  choixClientValue,
  setChoixClientValue,
  AjouterPlan,
  clients,
}) => {
  return (
    <div className={styles.frame48095628}>
      <div className={styles.frame1000001842}>
        <div className={styles.frame1000001843}>
          <div className={styles.frame1000001836}>
            <div className={styles.frame1000001839}>
              <div className={styles.frame10000018372}>
                <div className={styles.frame782}>
                  <input
                    type="text"
                    className={styles.nomPlan}
                    placeholder="Nom du plan *"
                    value={nomValue}
                    onChange={(e) => setNomValue(e.target.value)}
                  />
                </div>
                <div className={styles.frame792}>
                  <input
                    type="text"
                    className={styles.tarification}
                    placeholder="Tarification *"
                    value={tarificationValue}
                    onChange={(e) => setTarificationValue(e.target.value)}
                  />
                  <span className={styles.tarification2}> DA</span>
                </div>
                <div className={styles.frame792}>
                  <input
                    type="text"
                    className={styles.nombreMessage}
                    placeholder="Nombre de message *"
                    value={nombreMessageValue}
                    onChange={(e) => setNombreMessageValue(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.frame10000018372}>
                <div className={styles.frame7821}>
                  <input
                    type="text"
                    className={styles.duree}
                    placeholder="Durée *"
                    value={dureeValue}  
                    onChange={(e) => setDureeValue(e.target.value)}
                  /><span className={styles.duree2}> mois</span>
                </div>
                <div className={styles.frame7921}>
                  <select
                    className={styles.choixClient}
                    name="client_id"
                    value={choixClientValue}
                    onChange={(e) => setChoixClientValue(e.target.value)}
                  >
                    <option value="">Choisissez le client *</option>
                    {/* Affichage des options avec le nom de l'entreprise */}
                    {clients.map((client) => (
                      <option key={client.client_id} value={client.client_id}>
                        {client.corporation_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.group1572}>
          <button className={styles.btnBg2} onClick={AjouterPlan}>
            <div className={styles.btnText2}>Enregistrer les modifications</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreerPlanInterface;
