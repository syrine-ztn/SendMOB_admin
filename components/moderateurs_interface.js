import React, { useState, useEffect } from 'react';
import styles from '../styles/moderateurs_interface.module.css';
import Link from 'next/link';
import { useTable } from 'react-table';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const ModerateursInterface = () => {
  const [moderateurs, setModerateurs] = useState([]);
  const [allModerateurs, setAllModerateurs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchModerateurs = async () => {
      const token = localStorage.getItem('token');
  
      try {
        // Fetch all modérateurs without pagination
        const response1 = await axios.get(`http://localhost:8000/moderateurs/getAllModerateurs`, {
          headers: {
            Authorization: `${token}`,
          },
        });
  
        // Apply filter if statusFilter is not empty
        let filteredData = response1.data;
        if (statusFilter) {
          filteredData = response1.data.filter((moderateur) => moderateur.status_mod === statusFilter);
        }
  
        // Set all modérateurs including filtered data
        setAllModerateurs(filteredData);
  
        // Calculate total pages based on filtered data
        const totalCount = filteredData.length;
        const moderateursPerPage = 10;
        const totalPagesCount = Math.ceil(totalCount / moderateursPerPage);
        setTotalPages(totalPagesCount);
  
        // Fetch data for the current page with pagination and status filter
        const response = await axios.get(`http://localhost:8000/moderateurs/getAllModerateurs/${page}/${statusFilter}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        // Set modérateurs for the current page
        setModerateurs(response.data);
      } catch (error) {
        console.error('Error fetching modérateurs:', error);
      }
    };
  
    fetchModerateurs();
  }, [page, statusFilter]);
  


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

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredModerateurs = statusFilter
    ? allModerateurs.filter((moderateur) => moderateur.status_mod === statusFilter)
    : moderateurs;

  return (
    <div className={styles.container}>
      <Component1 />
      <Component2 
        handleStatusFilterChange={handleStatusFilterChange} 
        statusFilter={statusFilter}
        data={moderateurs}
        allData={allModerateurs} // Pass allModerateurs to Component2
      />
      <ModerateursTable data={moderateurs} setModerateurs={setModerateurs} />
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
      <div className={styles.pageTitle}>Pages / Modérateurs</div>
      <div className={styles.statistiques}>Modérateurs et affectations</div>
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

const Component2 = ({ handleStatusFilterChange, statusFilter, data, allData }) => {
  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(allData.map(({ password, client_id, ...rest }) => rest)); // Use allData instead of data
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Moderateurs');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(dataBlob, 'Moderateurs.xlsx');
  };

  return (
    <div className={styles.container2}>
      <Link href="#" className={styles.button1}>
        <div className={styles.statusIcon}></div>
        <select value={statusFilter} onChange={handleStatusFilterChange} className={styles.statusText}>
          <option className={styles.statusText} value="">Statut</option>
          <option className={styles.statusAct} value="Actif">Actif</option>
          <option className={styles.statusSus} value="Suspendu">Suspendu</option>
        </select>
      </Link>
      
      <CSVLink data={allData.map(({ password, client_id, ...rest }) => rest)} filename={"Moderateurs.csv"} className={styles.button2}>
        <div className={styles.icon1}></div>
      </CSVLink>

      <Link href="#" onClick={handleDownloadExcel} className={styles.button3}>
        <div className={styles.icon2}></div>
      </Link>

      <Link href="/creer_moderateur" className={styles.clientButton}>
        <div className={styles.icon}></div>
        <div className={styles.buttonText}>Créer un nouveau modérateur</div>
      </Link>
    </div>
  );
};


const ModerateursTable = ({ data, setModerateurs }) => {
  
  const [isFrameVisible, setIsFrameVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupAction, setPopupAction] = useState(null);

  const handlePopUpClick = async (elementId) => {
    try {
      const token = localStorage.getItem('token');
      if (selectedUserId !== null) {
        switch (elementId) {
          case 'bloquerbtn':
            await axios.put(`http://localhost:8000/moderateurs/blockModerateur/${selectedUserId}`, null, {
              headers: {
                Authorization: `${token}`,
              },
            });
            setModerateurs((prevModerateurs) =>
              prevModerateurs.map((moderateur) =>
                moderateur.mod_id === selectedUserId ? { ...moderateur, status_mod: 'Suspendu' } : moderateur
              )
            );
            break;
          case 'debloquerbtn':
            await axios.put(`http://localhost:8000/moderateurs/debloquerModerateur/${selectedUserId}`, null,
            {
              headers: {
                Authorization: `${token}`,
              },
            });
            setModerateurs((prevModerateurs) =>
              prevModerateurs.map((moderateur) =>
                moderateur.mod_id === selectedUserId ? { ...moderateur, status_mod: 'Actif' } : moderateur
              )
            );
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error(`Error processing moderator action:`, error);
    }
    setPopupVisibility(false);
  };

  const visibilityClick = (userId, status) => {
    setIsFrameVisible((prevVisibility) => !prevVisibility);
    setSelectedUserId(userId);
    if (status === 'Suspendu') {
      setPopupMessage('Voulez-vous vraiment activer ce modérateur ?');
      setPopupAction('debloquerbtn');
    } else {
      setPopupMessage('Voulez-vous vraiment suspendre ce modérateur ?');
      setPopupAction('bloquerbtn');
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Modérateur ID',
        accessor: 'mod_id',
      },
      {
        Header: 'Nom',
        accessor: 'nom_mod',
      },
      {
        Header: 'Prénom',
        accessor: 'prenom_mod',
      },
      {
        Header: 'Téléphone',
        accessor: 'numero_telephone_mod',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Statut',
        accessor: 'status_mod',
        Cell: ({ row }) => (
          <div className={`${styles.statut} ${row.original.status_mod === 'Actif' ? styles.actif : styles.bloque}`}>
            {row.original.status_mod}
          </div>
        ),
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: ({ row }) => (
          <button onClick={() => visibilityClick(row.original.mod_id, row.original.status_mod)} className={styles.action}>
            Voir les détails
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
            <div className={styles.phX} onClick={() => setPopupVisibility(false)}></div>

            <div className={styles.frame1000001834}>
              <p className={styles.Message}>{popupMessage}</p>
            </div>

            <div className={styles.group2219}>
              <button
                className={`${styles.button} ${popupAction === 'bloquerbtn' ? styles.redButton : styles.greenButton}`}
                onClick={() => handlePopUpClick(popupAction)}
              >
                <div className={styles.horizontalStack}>
                  <div className={styles.bloquerbtn}>{popupAction === 'bloquerbtn' ? 'Suspendre' : 'Activer'}</div>
                </div>
              </button>

              <button
                className={`${styles.button} ${styles.whiteButton}`}
                onClick={() => setPopupVisibility(false)}
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
          href={{ pathname: '/modifier_moderateur', query: { userId: selectedUserId } }}
          as={`/modifier_moderateur?userId=${selectedUserId}`}
          className={styles.frame18}
        >
          <span className={styles.modifierProfil}>Modifier le profil</span>
        </Link>

        <button className={styles.frame19} onClick={() => setPopupVisibility(true)}>
          <span className={styles.bloquer}>{popupAction === 'bloquerbtn' ? 'Suspendre' : 'Activer'}</span>
        </button>
      </div>

      <table {...getTableProps()} className={styles.moderateurTableContainer}>
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

export default ModerateursInterface;
