import React, { useState, useEffect } from 'react';
import styles from '../styles/modifier_plan_interface.module.css';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

const ModifierPlanInterface = () => {
  const router = useRouter();
  const { planId } = router.query;

  const [planInfo, setPlanInfo] = useState({
    nom_plan: '',
    prix: '',
    duree: '',
    nombre_message: '',
    client_id: '',
  });

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchPlanInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const planResponse = await axios.get(`http://localhost:8000/plans/getPlanById/${planId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const { nom_plan, prix, duree, nombre_message, plans_clients } = planResponse.data;
        const client_id = plans_clients.length > 0 ? plans_clients[0].client_id : '';

        setPlanInfo({ nom_plan, prix, duree, nombre_message, client_id });

        // Fetch clients
        const clientsResponse = await axios.get('http://localhost:8000/clients/getAllClients', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setClients(clientsResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations sur le plan ou des clients:', error);
      }
    };

    if (planId) {
      fetchPlanInfo();
    }
  }, [planId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlanInfo({ ...planInfo, [name]: value });
  };

  const modifierPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:8000/plans/updatePlan/${planId}`, planInfo, {
        headers: {
          Authorization: `${token}`,
        },
      });


      const response1 = await axios.get(`http://localhost:8000/clients/getClientById/${planInfo.client_id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });


      
      // Extraire le corporation_name du client sélectionné
      const corporationName = response1.data.corporation_name;

      if (response1.data.mod_id) {
    
     await axios.post(
      `http://localhost:8000/notifications/moderateur/notifier/${response1.data.mod_id}`,
      {
        type_notification: 'Modification de plan',
        contenu: `Le plan ${planInfo.nom_plan} pour le client ${corporationName} a été modifié.`,
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
      `http://localhost:8000/notifications/notifier/${planInfo.client_id}`,
      {
        type_notification: 'Modification de plan',
        contenu: `Votre plan ${planInfo.nom_plan} a été modifié avec succès.`,
        date_notification: new Date().toISOString(),
        client_id: planInfo.client_id,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );


      console.log('Plan modifié:', response.data);
      // Rediriger vers la page des plans après modification
      window.location.href = '/plans';
    } catch (error) {
      console.error('Erreur lors de la modification du plan:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Component1 />
      <Component2
        planInfo={planInfo}
        clients={clients}
        handleInputChange={handleInputChange}
        modifierPlan={modifierPlan}
      />
    </div>
  );
};

const Component1 = () => {
  return (
    <div className={styles.dashboardInterface}>
      <div className={styles.pageTitle}>Pages / Plans / Modifier le plan</div>
      <div className={styles.statistiques}>Modifier le plan</div>
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

const Component2 = ({ planInfo, clients, handleInputChange, modifierPlan }) => {
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
                    name="nom_plan"
                    value={planInfo.nom_plan}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.frame792}>
                  <input
                    type="text"
                    className={styles.tarification}
                    placeholder="Tarification *"
                    name="prix"
                    value={planInfo.prix}
                    onChange={handleInputChange}
                  />
                  <span className={styles.tarification2}> DA</span>
                </div>
                <div className={styles.frame792}>
                  <input
                    type="text"
                    className={styles.nombreMessage}
                    placeholder="Nombre de message *"
                    name="nombre_message"
                    value={planInfo.nombre_message}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className={styles.frame10000018372}>
                <div className={styles.frame7821}>
                  <input
                    type="text"
                    className={styles.duree}
                    placeholder="Durée *"
                    name="duree"
                    value={planInfo.duree}
                    onChange={handleInputChange}
                  /><span className={styles.duree2}> mois</span>
                </div>
                <div className={styles.frame7921}>
                  <select
                    className={styles.choixClient}
                    name="client_id"
                    value={planInfo.client_id}
                    onChange={handleInputChange}
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
          <button className={styles.btnBg2} onClick={modifierPlan}>
            <div className={styles.btnText2}>Enregistrer les modifications</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifierPlanInterface;
