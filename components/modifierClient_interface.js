import React, { useState,useEffect } from 'react';
import styles from '../styles/modifierClient_interface.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios'; // Importez axios

const ModifierClientInterface = () => {
  const router = useRouter();
  const { userId } = router.query;

  const [formData, setFormData] = useState({
    corporation_name: '',
    corporation_short_name: '',
    corporation_code: '',
    certificate_type: '',
    certificate_number: '',
    brn_expiry_date: '',
    customer_level: '',
    legal_form: '',
    tax_id: '',
    industry: '',
    sub_industry: '',
    phone_number: '',
    email: '',
    fax_number: '',
    customer_grade: '',
    size_level: '',
    register_date: '',
    register_capital: '',
    parent_customer: '',
    remark: '',
    customer_language: '',
    written_language: '',
    tax_exemption: '',
  });

  useEffect(() => {
    // Fonction pour récupérer les données du client à partir de l'API
    const fetchClientData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:8000/clients/getClientById/${userId}`, // endpoint pour récupérer les données du client
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const clientData = response.data; // données du client récupérées depuis l'API
        // Mettre à jour l'état local avec les données du client
        setFormData(clientData);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    // Appeler la fonction pour récupérer les données du client lors du chargement de la page
    fetchClientData();
  }, [userId]); // Déclencher le chargement des données du client lorsque userId change

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/clients/updateClient/${userId}`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );


        const response1 = await axios.get(
          `http://localhost:8000/clients/getClientById/${userId}`, // endpoint pour récupérer les données du client
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const mod_id = response1.data.mod_id; // données du client récupérées depuis l'API

        if (mod_id) {
       // Notifier le moderateur
       await axios.post(
        `http://localhost:8000/notifications/moderateur/notifier/${mod_id}`,
        {
          type_notification: 'Modification de client',
          contenu: `Le client ${formData.corporation_name} a été modifié.`,
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
        `http://localhost:8000/notifications/notifier/${userId}`,
        {
          type_notification: 'Modification de compte',
          contenu: `Votre compte pour ${formData.corporation_name} a été modifié.`,
          date_notification: new Date().toISOString(),
          client_id: userId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );


      console.log('Client updated successfully:', response.data);
      // Rediriger l'utilisateur vers une autre page
      router.push('/clients');
    } catch (error) {
      console.error('Error updating client:', error);
      // Afficher un message d'erreur à l'utilisateur
    }
  };

  return (
    <div className={styles.container}>
      <Component1 />
      <Component2
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

const Component1 = () => {
  return (
    <div className={styles.dashboardInterface}>
      <div className={styles.pageTitle}>
        Pages / Clients / Modification du compte client
      </div>
      <div className={styles.statistiques}>Modifier le compte client</div>
      <div className={styles.misc}>
        <div className={styles.rectangle356}>
          <div className={styles.searchContainer}>
            <div className={styles.largeInput}>
              <div className={styles.background}></div>
              <div className={styles.searchIcon}>
                <div className={styles.ellipse6}></div>
                <div className={styles.line1}></div>
                <input
                  className={styles.textrecherche}
                  type="text"
                  placeholder="Recherche"
                />
              </div>
            </div>
            <div className={styles.notificationsIcon}>
              <div className={styles.vector}></div>
              <div className={styles.notification}></div>
              <div className={styles.notificationStyle}>
                <Link href="/notifications" className={styles.notificationLink}>
  
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Component2 = ({ formData, handleChange, handleSubmit }) => {
  return (
    <div className={styles.frame48095628}>
      <div className={styles.frame1000001836}>
        <div className={styles.frame1000001845}>
        <div className={styles.frame1000001837}>
            <div className={styles.frame78}>
              <input
                type="text"
                className={styles.corporationName}
                placeholder="Corporation Name *"
                value={formData.corporation_name}
                onChange={handleChange}
                name="corporation_name"
              />
            </div>
            {/* Ajoutez les autres champs de formulaire ici */}
            <div className={styles.frame78}>
              <input
                type="text"
                className={styles.corporationShortName}
                placeholder="Corporation Short Name *"
                value={formData.corporation_short_name}
                onChange={handleChange}
                name="corporation_short_name"
              />
            </div>
            <div className={styles.frame79}>
              <input
                type="text"
                className={styles.corporationCode}
                placeholder="Corporation Code *"
                value={formData.corporation_code}
                onChange={handleChange}
                name="corporation_code"
              />
            </div>
          </div>
          <div className={styles.frame1000001838}>
  <div className={styles.frame78}>
    <input
      type="text"
      className={styles.certificateType}
      placeholder="Certificate Type *"
      value={formData.certificate_type}
      onChange={handleChange}
      name="certificate_type"
    />
  </div>
  <div className={styles.frame80}>
    <input
      type="text"
      className={styles.certificateNumber}
      placeholder="Certificate Number *"
      value={formData.certificate_number}
      onChange={handleChange}
      name="certificate_number"
    />
  </div>
  <div className={styles.frame79}>
    <input
      type="text"
      className={styles.brnExpiryDate}
      placeholder="BRN Expiry Date *"
      value={formData.brn_expiry_date}
      onChange={handleChange}
      name="brn_expiry_date"
    />
  </div>
</div>

<div className={styles.frame1000001839}>
  <div className={styles.frame78}>
    <input
      type="text"
      className={styles.customerLevel}
      placeholder="Customer Level *"
      value={formData.customer_level}
      onChange={handleChange}
      name="customer_level"
    />
  </div>
  <div className={styles.frame80}>
    <input
      type="text"
      className={styles.legalForm}
      placeholder="Legal Form *"
      value={formData.legal_form}
      onChange={handleChange}
      name="legal_form"
    />
  </div>
  <div className={styles.frame79}>
    <input
      type="text"
      className={styles.taxID}
      placeholder="Tax ID *"
      value={formData.tax_id}
      onChange={handleChange}
      name="tax_id"
    />
  </div>
</div>
<div className={styles.frame1000001840}>
  <div className={styles.frame78}>
    <input
      type="text"
      className={styles.industry}
      placeholder="Industry *"
      value={formData.industry}
      onChange={handleChange}
      name="industry"
    />
  </div>
  <div className={styles.frame80}>
    <input
      type="text"
      className={styles.subIndustry}
      placeholder="Sub Industry *"
      value={formData.sub_industry}
      onChange={handleChange}
      name="sub_industry"
    />
  </div>
  <div className={styles.frame79}>
    <input
      type="text"
      className={styles.phoneNumber}
      placeholder="Phone Number *"
      value={formData.phone_number}
      onChange={handleChange}
      name="phone_number"
    />
  </div>
</div>

<div className={styles.frame1000001841}>
  <div className={styles.frame78}>
    <input
      type="text"
      className={styles.email}
      placeholder="Email *"
      value={formData.email}
      onChange={handleChange}
      name="email"
    />
  </div>
  <div className={styles.frame80}>
    <input
      type="text"
      className={styles.fax}
      placeholder="Fax Number *"
      value={formData.fax_number}
      onChange={handleChange}
      name="fax_number"
    />
  </div>
  <div className={styles.frame79}>
    <input
      type="text"
      className={styles.grade}
      placeholder="Customer Grade *"
      value={formData.customer_grade}
      onChange={handleChange}
      name="customer_grade"
    />
  </div>
</div>


<div className={styles.frame1000001842}>
  <div className={styles.frame78}>
    <input
      type="text"
      className={styles.sizeLevel}
      placeholder="Size Level *"
      value={formData.size_level}
      onChange={handleChange}
      name="size_level"
    />
  </div>
  <div className={styles.frame80}>
    <input
      type="text"
      className={styles.registerDate}
      placeholder="Register Date *"
      value={formData.register_date}
      onChange={handleChange}
      name="register_date"
    />
  </div>
  <div className={styles.frame79}>
    <input
      type="text"
      className={styles.registerCapital}
      placeholder="Register Capital *"
      value={formData.register_capital}
      onChange={handleChange}
      name="register_capital"
    />
  </div>
</div>


<div className={styles.frame1000001843}>
  <div className={styles.frame8}>
    <input
      type="text"
      className={styles.parentCustomer}
      placeholder="Parent Customer *"
      value={formData.parent_customer}
      onChange={handleChange}
      name="parent_customer"
    />
  </div>
  <div className={styles.frame80}>
    <input
      type="text"
      className={styles.remark}
      placeholder="Remark *"
      value={formData.remark}
      onChange={handleChange}
      name="remark"
    />
  </div>
</div>


<div className={styles.frame1000001844}>
  <div className={styles.frame78}>
    <input
      type="text"
      className={styles.customerLanguage}
      placeholder="Customer Language *"
      value={formData.customer_language}
      onChange={handleChange}
      name="customer_language"
    />
  </div>
  <div className={styles.frame80}>
    <input
      type="text"
      className={styles.writtenLanguage}
      placeholder="Written Language *"
      value={formData.written_language}
      onChange={handleChange}
      name="written_language"
    />
  </div>
  <div className={styles.frame79}>
    <input
      type="text"
      className={styles.taxExemption}
      placeholder="Tax Exemption *"
      value={formData.tax_exemption}
      onChange={handleChange}
      name="tax_exemption"
    />
  </div>
</div>
        </div>
      </div>
      <div className={styles.group157}>
        <button className={styles.btnBg} onClick={handleSubmit}>
          <div className={styles.text}>Enregistrer les modifications</div>
        </button>
      </div>
    </div>
  );
};

export default ModifierClientInterface;
