import React, { useState } from 'react';
import styles from '../styles/creerClient_interface.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

const CreerClientInterface = () => {
  const router = useRouter();
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
    password: '',
    dossier_entreprise: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/clients/createClient',
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

       const { client_id } = response.data;

       // Notifier le client
       await axios.post(
        `http://localhost:8000/notifications/notifier/${client_id}`,
        {
          type_notification: 'Creation de compte',
          contenu: `Votre compte pour ${formData.corporation_name} a été créé avec succès.`,
          date_notification: new Date().toISOString(),
          client_id: client_id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log('Client created successfully:', response.data);
      // Afficher un message de succès ou rediriger l'utilisateur
    router.push('/clients');
    } catch (error) {
      console.error('Error creating client:', error);
      // Afficher un message d'erreur à l'utilisateur
    }
  };

  return (
    <div className={styles.container}>
      <Component1 />
      <Component2 formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
    </div>
  );
};

const Component1 = () => {
  return ( 
    <div className={styles.dashboardInterface}>
    <div className={styles.pageTitle}>Pages / Clients / Créer un nouveau compte client</div>
    <div className={styles.statistiques}>Créer un nouveau compte client</div>
    <div className={styles.misc}>
      <div className={styles.rectangle356}>
        <div className={styles.searchContainer}>
          <div className={styles.largeInput}>
            <div className={styles.background}></div>
            <div className={styles.searchIcon}>
              <div className={styles.ellipse6}></div>
              <div className={styles.line1}></div>
              <input className={styles.textrecherche} type="text" placeholder="Recherche" />
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

const Component2 = ({ formData, handleChange, handleSubmit }) => {
  const [isPopupVisible, setPopupVisibility] = useState(false);

  const handlePopUpClick = (elementId) => {
    switch (elementId) {
      case 'btnBg':
        setPopupVisibility(!isPopupVisible);
        //Ajouter le client dans database
        break;
      case 'phX':
        setPopupVisibility(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.frame48095628}>
      {isPopupVisible && (
        <div className={styles.group2220}>
          <div className={styles.rectangle4429}>
            <div className={styles.phX} onClick={() => handlePopUpClick('phX')}></div>
            <div className={styles.ok}></div>
            <div className={styles.frame1000001834}>
              <p className={styles.Message}>Compte client créé avec succès !</p>
            </div>
          </div>
        </div>
      )}

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


<div className={styles.frame10000018455}>
  <div className={styles.frame781}>
    <input
      type="password"
      className={styles.attribuerMotDePasse}
      placeholder="Attribuer un mot de passe *"
      value={formData.password}
      onChange={handleChange}
      name="password"
    />
  </div>
</div>

<div className={styles.group157}>
<button className={styles.btnBg} onClick={(e) => {handleSubmit(e); handlePopUpClick('btnBg');}}>
  <div className={styles.text}>Créer le compte client</div>
</button>
</div>
        </div>
      </div>
    </div>
  );
};

export default CreerClientInterface; 
