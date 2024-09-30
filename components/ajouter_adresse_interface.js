import React, { useState } from 'react';
import styles from '../styles/ajouter_adresse_interface.module.css';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

const AjouterAdresseInterface = () => {
  const router = useRouter();
  const { userId } = router.query;

  const [nationalityValue, setNationalityValue] = useState('');
  const [stateProvinceValue, setStateProvinceValue] = useState('');
  const [districtRegionValue, setDistrictRegionValue] = useState('');
  const [cityValue, setCityValue] = useState('');
  const [streetValue, setStreetValue] = useState('');
  const [blockValue, setBlockValue] = useState('');
  const [houseNumberValue, setHouseNumberValue] = useState('');
  const [postalCodeValue, setPostalCodeValue] = useState('');
  const [addressTypeValue, setAddressTypeValue] = useState('');
  const [operationTypeValue, setOperationTypeValue] = useState('');

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/adresses/createAdresse',
        {
          client_id: userId,
          nationality: nationalityValue,
          state_province: stateProvinceValue,
          district_region: districtRegionValue,
          city: cityValue,
          street: streetValue,
          block: blockValue,
          house_number: houseNumberValue,
          postal_code: postalCodeValue,
          address_type: addressTypeValue,
          operation_type: operationTypeValue
        },
        {
          headers: {
            Authorization: `${token}`
          }
        }
      );


      const response1 = await axios.get(`http://localhost:8000/clients/getClientById/${userId}`, {
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
        type_notification: `Création d'adresse`,
        contenu: `Une nouvelle adresse a été crée pour le client ${corporationName}.`,
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
        type_notification: `Ajout d'une nouvelle adresse`,
        contenu: `Une nouvelle adresse a été ajoutée pour votre compte ${corporationName}.`,
        date_notification: new Date().toISOString(),
        client_id: userId,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );


      console.log('Adresse ajoutée avec succès:', response.data);
      window.location.href = `/adresses?userId=${userId}`;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'adresse:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Component1 />
      <Component2
        nationalityValue={nationalityValue} setNationalityValue={setNationalityValue}
        stateProvinceValue={stateProvinceValue} setStateProvinceValue={setStateProvinceValue}
        districtRegionValue={districtRegionValue} setDistrictRegionValue={setDistrictRegionValue}
        cityValue={cityValue} setCityValue={setCityValue}
        streetValue={streetValue} setStreetValue={setStreetValue}
        blockValue={blockValue} setBlockValue={setBlockValue}
        houseNumberValue={houseNumberValue} setHouseNumberValue={setHouseNumberValue}
        postalCodeValue={postalCodeValue} setPostalCodeValue={setPostalCodeValue}
        addressTypeValue={addressTypeValue} setAddressTypeValue={setAddressTypeValue}
        operationTypeValue={operationTypeValue} setOperationTypeValue={setOperationTypeValue}
        handleSaveChanges={handleSaveChanges}
      />
    </div>
  );
};

const Component1 = () => {
  return ( 
    <div className={styles.dashboardInterface}>
      <div className={styles.pageTitle}>Pages / Clients / Adresses du client / Ajouter une nouvelle adresse</div>
      <div className={styles.statistiques}>Ajouter une nouvelle adresse</div>
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
                <Link href="/notifications" className={styles.notificationLink} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Component2 = ({
  nationalityValue, setNationalityValue,
  stateProvinceValue, setStateProvinceValue,
  districtRegionValue, setDistrictRegionValue,
  cityValue, setCityValue,
  streetValue, setStreetValue,
  blockValue, setBlockValue,
  houseNumberValue, setHouseNumberValue,
  postalCodeValue, setPostalCodeValue,
  addressTypeValue, setAddressTypeValue,
  operationTypeValue, setOperationTypeValue,
  handleSaveChanges
}) => {
  return (
    <div className={styles.frame48095628}>
      <div className={styles.frame1000001842}>
        <div className={styles.frame1000001843}>
          <div className={styles.frame1000001836}>
            <div className={styles.frame10000018371}>
              <div className={styles.frame781}>
                <input type="text" className={styles.nationality} placeholder="Nationalité *" value={nationalityValue} onChange={(e) => setNationalityValue(e.target.value)} />
              </div>
              <div className={styles.frame791}>
                <input type="text" className={styles.stateProvince} placeholder="État/Province *" value={stateProvinceValue} onChange={(e) => setStateProvinceValue(e.target.value)} />
              </div>
              <div className={styles.frame791}>
                <input type="text" className={styles.districtArea} placeholder="District/Région *" value={districtRegionValue} onChange={(e) => setDistrictRegionValue(e.target.value)} />
              </div>
            </div>
            <div className={styles.frame1000001839}>
              <div className={styles.frame10000018372}>
                <div className={styles.frame782}>
                  <input type="text" className={styles.city} placeholder="Ville *" value={cityValue} onChange={(e) => setCityValue(e.target.value)} />
                </div>
                <div className={styles.frame792}>
                  <input type="text" className={styles.street} placeholder="Rue *" value={streetValue} onChange={(e) => setStreetValue(e.target.value)} />
                </div>
                <div className={styles.frame792}>
                  <input type="text" className={styles.block} placeholder="Bloc *" value={blockValue} onChange={(e) => setBlockValue(e.target.value)} />
                </div>
              </div>
              <div className={styles.frame10000018372}>
                <div className={styles.frame782}>
                  <input type="text" className={styles.houseNumber} placeholder="Numéro de maison *" value={houseNumberValue} onChange={(e) => setHouseNumberValue(e.target.value)} />
                </div>
                <div className={styles.frame792}>
                  <input type="text" className={styles.postcode} placeholder="Code postal *" value={postalCodeValue} onChange={(e) => setPostalCodeValue(e.target.value)} />
                </div>
                <div className={styles.frame792}>
                  <input type="text" className={styles.addressType} placeholder="Type d'adresse *" value={addressTypeValue} onChange={(e) => setAddressTypeValue(e.target.value)} />
                </div>
              </div>
              <div className={styles.frame10000018374}>
                <div className={styles.frame794}>
                  <input type="text" className={styles.operationType} placeholder="Type d'opération *" value={operationTypeValue} onChange={(e) => setOperationTypeValue(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.group1572}>
          <button className={styles.btnBg2} onClick={handleSaveChanges}>
            <div className={styles.btnText2}>Enregistrer les modifications</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AjouterAdresseInterface;
