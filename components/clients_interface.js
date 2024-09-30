import React, { useState, useEffect } from 'react';
import styles from '../styles/clients_interface.module.css';
import Link from 'next/link';
import { useTable } from 'react-table';
import axios from 'axios';
import Papa from 'papaparse'; // Bibliothèque pour parser les fichiers CSV

const ClientsInterface = () => {
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(1); // Définir la page initiale sur 1
  const [totalPages, setTotalPages] = useState(1); // Définir le nombre total de pages

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response1 = await axios.get(`http://localhost:8000/clients/getAllClients`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const response = await axios.get(`http://localhost:8000/clients/getAllClients/${page}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setClients(response.data);

        // Calculer le nombre total de pages en fonction de la longueur des données clients
        const totalCount = response1.data.length;
        const clientsPerPage = 10; // Supposons que 10 clients par page
        const totalPagesCount = Math.ceil(totalCount / clientsPerPage);
        setTotalPages(totalPagesCount);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, [page]); // Mettre à jour lorsque la page change

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className={styles.container}>
      <Component1 />
      <Component2 />
      <ClientTable data={clients} setClients={setClients} />
      <Pagination
        handlePageChange={handlePageChange}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
};

const Component1 = () => {
  return (
    <div className={styles.dashboardInterface}>
      <div className={styles.pageTitle}>Pages / Clients</div>
      <div className={styles.statistiques}>Comptes clients</div>
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

const ImportClients = () => {

  const [file, setFile] = useState(null);
  const [importStatus, setImportStatus] = useState(null); // Nouveau: état pour suivre le statut de l'importation
// Utiliser useEffect pour surveiller les changements de file
useEffect(() => {
  if (file) {
    handleImportClients(); // Appeler handleImportClients lorsque le fichier est sélectionné
  }
}, [file]);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
     
  };

  const handleImportClients = async () => {
    if (!file) return;
    setImportStatus('Importation en cours...');

    const importedClientKeys = new Set(); // Set pour suivre les entrées déjà traitées
    const results = await new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => resolve(results),
        error: (error) => reject(error),
      });
    });

    const clients = results.data.filter(client => Object.values(client).some(value => value.trim() !== '')); // Supprimer les lignes vides
    const token = localStorage.getItem('token');

    try {
      // Récupérer tous les clients existants
      const existingClientsResponse = await axios.get(`http://localhost:8000/clients/getAllClients`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      const existingClients = existingClientsResponse.data;

      for (const client of clients) {
        // Nettoyer les espaces vides dans chaque champ du client
        const cleanClient = {};
        Object.keys(client).forEach((key) => {
          const value = client[key]?.trim(); // Supprimer les espaces vides avant et après la valeur
          cleanClient[key] = value === '' ? null : value; // Remplacer les valeurs vides par null
        });

        // Vérifier s'il existe déjà un client avec le même corporation_name dans le fichier et dans la base de données
        const isDuplicate = existingClients.some(existingClient => existingClient.corporation_name === cleanClient.corporation_name);
        if (isDuplicate || importedClientKeys.has(cleanClient.corporation_name)) {
          console.log(`Client with corporation_name ${cleanClient.corporation_name} already exists. Skipping...`);
          continue; // Passer au client suivant
        }

        // Vérifier s'il existe déjà un client avec le même email
        const isDuplicateEmail = existingClients.some(existingClient => existingClient.email === cleanClient.email);
        if (isDuplicateEmail || importedClientKeys.has(cleanClient.email)) {
          console.log(`Client with email ${cleanClient.email} already exists. Skipping...`);
          continue; // Passer au client suivant
        }

        // Vérifier s'il existe déjà un client avec le même phone_number
        const isDuplicatePhoneNumber = existingClients.some(existingClient => existingClient.phone_number === cleanClient.phone_number);
        if (isDuplicatePhoneNumber || importedClientKeys.has(cleanClient.phone_number)) {
          console.log(`Client with phone_number ${cleanClient.phone_number} already exists. Skipping...`);
          continue; // Passer au client suivant
        }

        // Vérifier s'il existe déjà un client avec le même corporation_code
        const isDuplicateCorporationCode = existingClients.some(existingClient => existingClient.corporation_code === cleanClient.corporation_code);
        if (isDuplicateCorporationCode || importedClientKeys.has(cleanClient.corporation_code)) {
          console.log(`Client with corporation_code ${cleanClient.corporation_code} already exists. Skipping...`);
          continue; // Passer au client suivant
        }

        // Vérifier s'il existe déjà un client avec le même certificate_number
        const isDuplicateCertificateNumber = existingClients.some(existingClient => existingClient.certificate_number === cleanClient.certificate_number);
        if (isDuplicateCertificateNumber || importedClientKeys.has(cleanClient.certificate_number)) {
          console.log(`Client with certificate_number ${cleanClient.certificate_number} already exists. Skipping...`);
          continue; // Passer au client suivant
        }

        // Vérifier s'il existe déjà un client avec le même tax_id
        const isDuplicateTaxId = existingClients.some(existingClient => existingClient.tax_id === cleanClient.tax_id);
        if (isDuplicateTaxId || importedClientKeys.has(cleanClient.tax_id)) {
          console.log(`Client with tax_id ${cleanClient.tax_id} already exists. Skipping...`);
          continue; // Passer au client suivant
        }

        // Ajouter les clés du client traité au Set
        importedClientKeys.add(cleanClient.corporation_name);
        importedClientKeys.add(cleanClient.email);
        importedClientKeys.add(cleanClient.phone_number);
        importedClientKeys.add(cleanClient.corporation_code);
        importedClientKeys.add(cleanClient.certificate_number);
        importedClientKeys.add(cleanClient.tax_id);

        // Mapper les champs du CSV aux champs de la base de données
        const mappedClient = {
          corporation_name: cleanClient.corporation_name || '',
          corporation_short_name: cleanClient.corporation_short_name || '',
          corporation_code: cleanClient.corporation_code || '',
          certificate_type: cleanClient.certificate_type || '',
          certificate_number: cleanClient.certificate_number || '',
          brn_expiry_date: cleanClient.brn_expiry_date || '',
          customer_level: cleanClient.customer_level || '',
          legal_form: cleanClient.legal_form || '',
          tax_id: cleanClient.tax_id || '',
          industry: cleanClient.industry || '',
          sub_industry: cleanClient.sub_industry || '',
          phone_number: cleanClient.phone_number || '',
          email: cleanClient.email || '',
          fax_number: cleanClient.fax_number || '',
          customer_grade: cleanClient.customer_grade || '',
          size_level: cleanClient.size_level || '',
          register_date: cleanClient.register_date || '',
          register_capital: cleanClient.register_capital || '',
          parent_customer: cleanClient.parent_customer || '',
          remark: cleanClient.remark || '',
          customer_language: cleanClient.customer_language || '',
          written_language: cleanClient.written_language || '',
          tax_exemption: cleanClient.tax_exemption || '',
          password: cleanClient.password || '',
          status: cleanClient.status || 'Actif',
          nationality: cleanClient.nationality || '',
          state_province: cleanClient.state_province || '',
          district_region: cleanClient.district_region || '',
          city: cleanClient.city || '',
          street: cleanClient.street || '',
          block: cleanClient.block || '',
          house_number: cleanClient.house_number || '',
          postal_code: cleanClient.postal_code || '',
          address_type: cleanClient.address_type || '',
          operation_type: cleanClient.operation_type || '',
          dossier_entreprise: cleanClient.dossier_entreprise || '',
          stripe_customer_id: cleanClient.stripe_customer_id || '',
        };

        // Créer le client s'il n'existe pas encore
        const createClientResponse = await axios.post('http://localhost:8000/clients/createClient', mappedClient, {
          headers: {
            Authorization: `${token}`,
          },
        });

        // Notifier le client
        await axios.post(
          `http://localhost:8000/notifications/notifier/${createClientResponse.data.client_id}`,
          {
            type_notification: 'Creation de compte',
            contenu: `Votre compte pour ${cleanClient.corporation_name} a été créé avec succès.`,
            date_notification: new Date().toISOString(),
            client_id: createClientResponse.data.client_id,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
      }

      setImportStatus('Importation réussie!');
    } catch (error) {
      console.error('Error creating client:', error);
      setImportStatus('Erreur lors de l\'importation');
    }
  };

  
  return (
    <div className={styles.importContainer}>
  <label className={styles.customFileInput}>
    <input type="file" accept=".csv" onChange={handleFileChange} />
    <div className={styles.icon2}></div>
    <p className={styles.buttonText2}>Importer une liste des clients</p>
  </label>
</div>
  );
};


const Component2 = () => {
  const handleButtonClick = () => {
    console.log('Client button clicked!');
  };

  return (
    <div>
    <Link href="/creer_client" className={styles.clientButton} onClick={handleButtonClick}>
      <div className={styles.icon}></div>
      <p className={styles.buttonText}>Créer un nouveau compte client</p>
    </Link>
    <ImportClients />
   </div>
  );
};

const ClientTable = ({ data, setClients }) => {
  const [isFrameVisible, setIsFrameVisible] = useState(false);
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const [isActivatePopupVisible, setActivatePopupVisibility] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handlePopUpClick = async (elementId) => {
    switch (elementId) {
      case 'frame19':
        setPopupVisibility(!isPopupVisible);
        break;
      case 'activatePopup':
        setActivatePopupVisibility(!isActivatePopupVisible);
        break;
      case 'annuler':
      case 'phX':
        setPopupVisibility(false);
        setActivatePopupVisibility(false);
        break;
      case 'bloquerbtn':
        try {
          if (selectedUserId !== null) {
            const token = localStorage.getItem('token');

            await axios.put(`http://localhost:8000/clients/blockClient/${selectedUserId}`, null, {
              headers: {
                Authorization: `${token}`,
              },
            });

            const updatedClients = data.map((user) => {
              if (user.client_id === selectedUserId) {
                return { ...user, status: 'Suspendu' };
              }
              return user;
            });

            setClients(updatedClients);
          }
        } catch (error) {
          console.error('Error blocking user:', error);
        }
        setPopupVisibility(false);
        break;
      case 'activerbtn':
        try {
          if (selectedUserId !== null) {
            const token = localStorage.getItem('token');

            await axios.put(`http://localhost:8000/clients/debloquerClient/${selectedUserId}`, null, {
              headers: {
                Authorization: `${token}`,
              },
            });

            const updatedClients = data.map((user) => {
              if (user.client_id === selectedUserId) {
                return { ...user, status: 'Actif' };
              }
              return user;
            });

            setClients(updatedClients);
          }
        } catch (error) {
          console.error('Error activating user:', error);
        }
        setActivatePopupVisibility(false);
        break;
      default:
        break;
    }
  };

  const visibilityClick = (userId) => {
    setIsFrameVisible((prevVisibility) => !prevVisibility);
    setSelectedUserId(userId);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'User ID',
        accessor: 'client_id',
      },
      {
        Header: 'Nom',
        accessor: 'corporation_name',
      },
      {
        Header: 'Certificate Type',
        accessor: 'certificate_type',
      },
      {
        Header: 'Customer Level',
        accessor: 'customer_level',
      },
      {
        Header: 'Industry',
        accessor: 'industry',
      },
      {
        Header: 'Date de création',
        accessor: 'register_date',
      },
      {
        Header: 'Statut',
        accessor: 'status',
        Cell: ({ row }) => (
          <div className={`${styles.status} ${row.original.status === 'Actif' ? styles.actif : styles.bloque}`}>
            {row.original.status}
          </div>
        ),
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: ({ row }) => (
          <button onClick={() => visibilityClick(row.original.client_id)} className={styles.action}>
            Action
          </button>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div>
      {isPopupVisible && (
        <div className={styles.group2220}>
          <div className={styles.rectangle4429}>
            <div className={styles.phX} onClick={() => handlePopUpClick('phX')}></div>
            <div className={styles.frame1000001834}>
              <p className={styles.Message}>Vous voulez vraiment suspendre cet utilisateur ?</p>
            </div>
            <div className={styles.group2219}>
              <button
                className={`${styles.button} ${styles.redButton}`}
                onClick={() => handlePopUpClick('bloquerbtn')}
              >
                <div className={styles.horizontalStack}>
                  <div className={styles.bloquerbtn}>Suspendre</div>
                </div>
              </button>
              <button
                className={`${styles.button} ${styles.whiteButton}`}
                onClick={() => handlePopUpClick('annuler')}
              >
                <div className={styles.horizontalStack}>
                  <div className={styles.annuler}>Annuler</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {isActivatePopupVisible && (
        <div className={styles.group2220}>
          <div className={styles.rectangle4429}>
            <div className={styles.phX} onClick={() => handlePopUpClick('phX')}></div>
            <div className={styles.frame1000001834}>
              <p className={styles.Message}>Vous voulez vraiment activer cet utilisateur ?</p>
            </div>
            <div className={styles.group2219}>
              <button
                className={`${styles.button} ${styles.greenButton}`}
                onClick={() => handlePopUpClick('activerbtn')}
              >
                <div className={styles.horizontalStack}>
                  <div className={styles.bloquerbtn}>Activer</div>
                </div>
              </button>
              <button
                className={`${styles.button} ${styles.whiteButton}`}
                onClick={() => handlePopUpClick('annuler')}
              >
                <div className={styles.horizontalStack}>
                  <div className={styles.annuler}>Annuler</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.frame42579} style={{ display: isFrameVisible ? 'block' : 'none' }}>
        <Link
          href={{ pathname: '/modifier_client', query: { userId: selectedUserId } }}
          as={`/modifier_client?userId=${selectedUserId}`}
          className={styles.frame18}
        >
          <span className={styles.modifierProfil}>Modifier le profil</span>
        </Link>
        <Link
          href={{ pathname: '/adresses', query: { userId: selectedUserId } }}
          as={`/adresses?userId=${selectedUserId}`}
          className={styles.frame21}
        >
          <span className={styles.modifierAdresse}>Adresses du client</span>
        </Link>
        <Link
          href={{ pathname: '/historique_paiements', query: { userId: selectedUserId } }}
          as={`/historique_paiements?userId=${selectedUserId}`}
          className={styles.frame20}
        >
          <span className={styles.historiquePaiement}>Historique de paiement</span>
        </Link>
        {data.find((user) => user.client_id === selectedUserId)?.status === 'Actif' ? (
          <button className={styles.frame19} onClick={() => handlePopUpClick('frame19')}>
            <span className={styles.bloquer}>Suspendre</span>
          </button>
        ) : (
          <button className={styles.frame19} onClick={() => handlePopUpClick('activatePopup')}>
            <span className={styles.bloquer}>Activer</span>
          </button>
        )}
      </div>

      <table {...getTableProps()} className={styles.clientTableContainer}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className={styles.tableHeader}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className={styles[column.id]}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className={styles.dataShow}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className={styles[cell.column.id]}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};


const Pagination = ({ handlePageChange, handlePrevPage, handleNextPage, currentPage, totalPages }) => {
  const chevronDownClick = () => {
    handlePrevPage();
  };

  const chevronUpClick = () => {
    handleNextPage();
  };

  return (
    <div className={styles.page}>
      <div className={styles.chevronDown}>
        <button onClick={chevronDownClick}></button>
      </div>
      <div className={styles.circle}>
        <div className={styles.text1}>{currentPage}</div>
        {currentPage > 1 && <button onClick={() => handlePageChange(currentPage - 1)}></button>}
      </div>
      <div className={styles.circle2}>
        <div className={styles.text2}>{currentPage + 1}</div>
        {currentPage + 1 <= totalPages && <button onClick={() => handlePageChange(currentPage + 1)}></button>}
      </div>
      <div className={styles.circle3}>
        <div className={styles.text3}>{currentPage + 2}</div>
        {currentPage + 2 <= totalPages && <button onClick={() => handlePageChange(currentPage + 2)}></button>}
      </div>
      <div className={styles.chevronUp}>
        <button onClick={chevronUpClick}></button>
      </div>
    </div>
  );
};

export default ClientsInterface;
