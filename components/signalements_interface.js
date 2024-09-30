import React, { useState, useEffect } from 'react';
import styles from '../styles/signalements_interface.module.css';
import Link from 'next/link';
import { useTable } from 'react-table';
import axios from 'axios';

const SignalementsInterface = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [signalements, setSignalements] = useState([]);

  useEffect(() => {
    const fetchSignalements = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/signalements/getAllSignalements/${page}`, {
          headers: {
            Authorization: token,
          },
        });
        const response1 = await axios.get(`http://localhost:8000/signalements/getAllSignalements`, {
          headers: {
            Authorization: token,
          },
        });
        setSignalements(response.data);

        const totalCount = response1.data.length;
        const signalementsPerPage = 10;
        const totalPagesCount = Math.ceil(totalCount / signalementsPerPage);
        setTotalPages(totalPagesCount);
      } catch (error) {
        console.error('Error fetching signalements:', error);
      }
    };

    fetchSignalements();
  }, [page]);

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
      <SignalementsTable signalements={signalements} setSignalements={setSignalements} />
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
      <div className={styles.pageTitle}>Pages / Signalements</div>
      <div className={styles.statistiques}>Signalements et rapports</div>
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

const Component2 = () => {
  const handleButtonClick = () => {
    console.log('Date button clicked!');
  };
};

const SignalementsTable = ({ signalements, setSignalements }) => {
  const [isFrameVisible, setIsFrameVisible] = useState(false);
  const [selectedSignalementId, setSelectedSignalementId] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');

  const visibilityClick = (signalementId) => {
    setIsFrameVisible((prevVisibility) => !prevVisibility);
    setSelectedSignalementId(signalementId);

    const token = localStorage.getItem('token');
    axios.get(`http://localhost:8000/signalements/getSignalementById/${signalementId}`, {
      headers: {
        Authorization: token,
      },
    })
      .then(response => setPopupMessage(response.data.entete))
      .catch(error => console.error('Error fetching signalement details:', error));
  };

  const handleMarkAsProcessed = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'oui' ? 'non' : 'oui';
      await axios.put(`http://localhost:8000/signalements/updateSignalement/${id}`, { traite: newStatus }, {
        headers: {
          Authorization: token,
        },
      });

      setSignalements((prevSignalements) =>
        prevSignalements.map((signalement) =>
          signalement.signalement_id === id ? { ...signalement, traite: newStatus } : signalement
        )
      );

      const response = await axios.get(`http://localhost:8000/signalements/getAllSignalements`, {
        headers: {
          Authorization: token,
        },
      });

      const updatedSignalement = response.data.find(signalement => signalement.signalement_id === id);

      if (!updatedSignalement) {
        console.error('Signalement non trouvé avec l\'ID:', id);
      } else if (!updatedSignalement.objet) {
        console.error('Objet du signalement non défini pour le signalement:', updatedSignalement);
      }

      if (!updatedSignalement || !updatedSignalement.objet) {
        throw new Error('Signalement ou objet du signalement non défini');
      }

      const notificationContent = (signalement) => {
        if (signalement.traite === 'oui') {
          switch (signalement.objet) {
            case 'Compte non mis à jour':
              return {
                type_notification: 'Traitement de Compte non mis à jour',
                client_contenu: 'Votre problème de compte non mis à jour a été traité.',
                mod_contenu: `Le traitement du signalement "Compte non mis à jour" du client ${signalement.client.corporation_name} a été effectué.`,
              };
            case 'Echec de paiement':
              return {
                type_notification: 'Traitement de l’échec de paiement',
                client_contenu: 'Votre problème d’échec de paiement a été traité.',
                mod_contenu: `Le traitement du signalement "Echec de paiement" du client ${signalement.client.corporation_name} a été effectué.`,
              };
            case 'Echec d’envoi de SMS':
              return {
                type_notification: 'Traitement de l’échec d’envoi de SMS',
                client_contenu: 'Votre problème d’échec d’envoi de SMS a été traité.',
                mod_contenu: `Le traitement du signalement "Echec d’envoi de SMS" du client ${signalement.client.corporation_name} a été effectué.`,
              };
            case 'Problème technique':
              return {
                type_notification: 'Traitement de Problème technique',
                client_contenu: 'Votre problème technique a été traité.',
                mod_contenu: `Le traitement du signalement "Problème technique" du client ${signalement.client.corporation_name} a été effectué.`,
              };
            default:
              return {
                type_notification: 'Traitement du signalement',
                client_contenu: 'Votre signalement a été traité.',
                mod_contenu: `Le traitement du signalement du client ${signalement.client.corporation_name} a été effectué.`,
              };
          }
        } else {
          switch (signalement.objet) {
            case 'Compte non mis à jour':
              return {
                type_notification: 'Signalement non traité',
                client_contenu: 'Il y a des traitements à effectuer à propos de votre problème de compte non mis à jour. Vous serez bientôt informé.',
                mod_contenu: `Le signalement "Compte non mis à jour" du client ${signalement.client.corporation_name} nécessite des traitements supplémentaires.`,
              };
            case 'Echec de paiement':
              return {
                type_notification: 'Signalement non traité',
                client_contenu: 'Il y a des traitements à effectuer à propos de votre problème d’échec de paiement. Vous serez bientôt informé.',
                mod_contenu: `Le signalement "Echec de paiement" du client ${signalement.client.corporation_name} nécessite des traitements supplémentaires.`,
              };
            case 'Echec d’envoi de SMS':
              return {
                type_notification: 'Signalement non traité',
                client_contenu: 'Il y a des traitements à effectuer à propos de votre problème d’échec d’envoi de SMS. Vous serez bientôt informé.',
                mod_contenu: `Le signalement "Echec d’envoi de SMS" du client ${signalement.client.corporation_name} nécessite des traitements supplémentaires.`,
              };
            case 'Problème technique':
              return {
                type_notification: 'Signalement non traité',
                client_contenu: 'Il y a des traitements à effectuer à propos de votre problème technique. Vous serez bientôt informé.',
                mod_contenu: `Le signalement "Problème technique" du client ${signalement.client.corporation_name} nécessite des traitements supplémentaires.`,
              };
            default:
              return {
                type_notification: 'Signalement non traité',
                client_contenu: 'Il y a des traitements à effectuer à propos de votre signalement. Vous serez bientôt informé.',
                mod_contenu: `Le signalement du client ${signalement.client.corporation_name} nécessite des traitements supplémentaires.`,
              };
          }
        }
      };

      const notificationPayload = notificationContent(updatedSignalement);

      // Notifier le client
      await axios.post(`http://localhost:8000/notifications/notifier/${updatedSignalement.client_id}`, {
        ...notificationPayload,
        contenu: notificationPayload.client_contenu,
        client_id: updatedSignalement.client_id,
        vu: 'non',
      }, {
        headers: {
          Authorization: token,
        },
      });

      const response1 = await axios.get(`http://localhost:8000/clients/getClientById/${updatedSignalement.client_id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response1.data.mod_id) {
        // Notifier le modérateur
        await axios.post(`http://localhost:8000/notifications/moderateur/notifier/${response1.data.mod_id}`, {
          ...notificationPayload,
          contenu: notificationPayload.mod_contenu,
          mod_id: response1.data.mod_id,
          vu: 'non',
        }, {
          headers: {
            Authorization: token,
          },
        });
      }

    } catch (error) {
      console.error('Error updating signalement:', error);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'signalement_id',
      },
      {
        Header: 'Client',
        accessor: 'client.corporation_name',
        Cell: ({ row }) => (
          <div className={styles.corporation_name}>{row.original.client.corporation_name}</div>
        )
      },
      {
        Header: 'Objet',
        accessor: 'objet',
      },
      {
        Header: 'Entête',
        accessor: 'entete',
      },
      {
        Header: 'Date d’envoi',
        accessor: 'date_envoi',
      },
      {
        Header: 'Traité',
        accessor: 'traite',
        Cell: ({ row }) => (
          <div className={row.original.traite === 'oui' ? styles.traiteOui : styles.traiteNon}>
            {row.original.traite}
          </div>
        ),
      },
      {
        Header: 'Traitement',
        accessor: 'marquer',
        Cell: ({ row }) => (
          <button
            onClick={row.original.traite === 'non' ? () => handleMarkAsProcessed(row.original.signalement_id, row.original.traite) : null}
            className={row.original.traite === 'oui' ? styles.markButtonTraite : styles.markButtonNonTraite}
            disabled={row.original.traite === 'oui'}
          >
            {row.original.traite === 'oui' ? 'Signalement déjà traité' : 'Marquer comme traité'}
          </button>
        ),
      },
      
      {
        Header: 'Action',
        accessor: 'action',
        Cell: ({ row }) => (
          <button onClick={() => visibilityClick(row.original.signalement_id)} className={styles.action}>
            Voir détails
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
  } = useTable({ columns, data: signalements });

  const handlePopUpClick = (elementId) => {
    switch (elementId) {
      case 'rectangle4429':
        setIsFrameVisible(!isFrameVisible);
        break;
      case 'phX':
        setIsFrameVisible(false);
        break;

      default:
        break;
    }
  };

  const getColumnStyle = (column) => {
    if (column.Header === 'Client') {
      return styles.corporation_name;
    } else {
      if (column.Header === `Date d’envoi`) 
        {return styles.date;} else {
      return styles[column.Header];
      }
    }
  };


  return (
    <div>
      <div className={styles.group2220} style={{ display: isFrameVisible ? 'block' : 'none' }}>
        <div className={styles.rectangle4429}>
          <div className={styles.phX} onClick={() => handlePopUpClick('phX')}></div>
          <div className={styles.frame1000001834}>
            <p className={styles.Message}>{popupMessage}</p>
          </div>
        </div>
      </div>

      <table {...getTableProps()} className={styles.signalementsTableContainer}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className={styles.tableHeader}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className={getColumnStyle(column)}>
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

export default SignalementsInterface;
