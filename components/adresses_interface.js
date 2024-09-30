import React, { useState, useEffect } from 'react';
import styles from '../styles/adresses_interface.module.css';
import Link from 'next/link';
import { useTable } from 'react-table';
import { useRouter } from 'next/router';
import axios from 'axios';

const AdressesInterface = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [adresses, setAdresses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAdresses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response1 = await axios.get(`http://localhost:8000/adresses/getAllAdressesForClient/${userId}`, {
          headers: {
            Authorization: `${token}`
          }
        });
        const response = await axios.get(`http://localhost:8000/adresses/getAllAdressesForClient/${userId}/${page}`, {
          headers: {
            Authorization: `${token}`
          }
        });
        setAdresses(response.data);

        // Calculer le nombre total de pages en fonction de la longueur des données des adresses
        const totalCount = response1.data.length;
        const addressesPerPage = 10; // Supposons que 10 adresses par page
        const totalPagesCount = Math.ceil(totalCount / addressesPerPage);
        setTotalPages(totalPagesCount);
      } catch (error) {
        console.error('Erreur lors de la récupération des adresses:', error);
      }
    };

    if (userId) {
      fetchAdresses();
    }
  }, [userId, page]);

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
      <Component2 userId={userId} />
      <AdressesTable data={adresses} userId={userId} />
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
      <div className={styles.pageTitle}>Pages / Clients / Adresses du client</div>
      <div className={styles.statistiques}>Adresses du client</div>
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

const Component2 = ({ userId }) => {
  return (
    <Link href={{ pathname: '/ajouter_adresse', query: { userId: userId } }} as={`/ajouter_adresse?userId=${userId}`} className={styles.clientButton}>
      <div className={styles.icon}></div>
      <p className={styles.buttonText}>Ajouter une nouvelle adresse</p>
    </Link>
  );
};

const AdressesTable = ({ data, userId }) => {
  const [isFrameVisible, setIsFrameVisible] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedAdresseId, setSelectedAdresseId] = useState(null);

  const handleElementClick = (frameId) => {
    if (frameId === 'frame19') {
      deleteAdresse(selectedAdresseId);
    }
  };

  const deleteAdresse = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/adresses/deleteAdresse/${id}`, {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log('Adresse supprimée avec succès');
      setIsFrameVisible(false); // Cacher le cadre après la suppression
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'adresse:', error);
    }
  };

  const visibilityClick = (adresse_id) => {
    setIsFrameVisible((prevVisibility) => !prevVisibility);
    setSelectedAdresseId(adresse_id);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Nationalité',
        accessor: 'nationality',
      },
      {
        Header: 'État/Province',
        accessor: 'state_province',
      },
      {
        Header: 'District/Région',
        accessor: 'district_region',
      },
      {
        Header: 'Ville',
        accessor: 'city',
      },
      {
        Header: 'Rue',
        accessor: 'street',
      },
      {
        Header: 'Bloc',
        accessor: 'block',
      },
      {
        Header: 'Numéro de maison',
        accessor: 'house_number',
      },
      {
        Header: 'Code postal',
        accessor: 'postal_code',
      },
      {
        Header: 'Type d\'adresse',
        accessor: 'address_type',
      },
      {
        Header: 'Type d\'opération',
        accessor: 'operation_type',
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: ({ row }) => (
          <button onClick={() => visibilityClick(row.original.adresse_id)} className={styles.action}>
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
      <div className={styles.frame42579} style={{ display: isFrameVisible ? 'block' : 'none' }}>
        <Link href={{ pathname: '/modifier_adresse', query: { adresseId: selectedAdresseId, userId: userId } }} as={`/modifier_adresse?adresseId=${selectedAdresseId}&userId=${userId}`} className={styles.frame18}>
          <span className={styles.modifierAdresse}>Modifier l'adresse</span>
        </Link>
        <button className={styles.frame19} onClick={() => handleElementClick('frame19')}>
          <span className={styles.supprimer}>Supprimer l'adresse</span>
        </button>
      </div>
      <table {...getTableProps()} className={styles.adressesTableContainer}>
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

const Pagination = ({ handlePageChange, handlePrevPage, handleNextPage, currentPage, totalPages }) => (
  <div className={styles.page}>
    <div className={styles.chevronDown}>
      <button onClick={handlePrevPage}></button>
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
      <button onClick={handleNextPage}></button>
    </div>
  </div>
);

export default AdressesInterface;
