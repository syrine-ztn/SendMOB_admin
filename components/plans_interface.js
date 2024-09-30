import React, { useState, useEffect } from 'react';
import styles from '../styles/plans_interface.module.css';
import Link from 'next/link';
import axios from 'axios';
import { useTable } from 'react-table';

const PlansInterface = () => {
  const [plans, setPlans] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem('token');

        const response1 = await axios.get(`http://localhost:8000/plans/getAllPlans`, {
          headers: {
            Authorization: `${token}`, 
          },
        });

        const response = await axios.get(`http://localhost:8000/plans/getAllPlans/${page}`, {
          headers: {
            Authorization: `${token}`, 
          },
        });
        setPlans(response.data);

        // Calculer le nombre total de pages en fonction de la longueur des données des plans
        const totalCount = response1.data.length;
        const plansPerPage = 10; // Supposons que 10 plans par page
        const totalPagesCount = Math.ceil(totalCount / plansPerPage);
        setTotalPages(totalPagesCount);
      } catch (error) {
        console.error('Erreur lors de la récupération des plans:', error);
      }
    };

    fetchPlans();
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
      <Component3 plans={plans} />
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
      <div className={styles.pageTitle}>Pages / Plans</div>
      <div className={styles.statistiques}>Plans et tarifications</div>
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
    console.log('Client button clicked!');
  };

  return (
    <Link href="/creer_plan" className={styles.clientButton} onClick={handleButtonClick}>
      <div className={styles.icon}></div>
      <p className={styles.buttonText}>Créer un nouveau plan</p>
    </Link>
  );
};

const Component3 = ({ plans }) => {
  const [isFrameVisible, setIsFrameVisible] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');

  const visibilityClick = (planId) => {
    setIsFrameVisible((prevVisibility) => !prevVisibility);
    setSelectedPlanId(planId);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Plan ID',
        accessor: 'plan_id',
      },
      {
        Header: 'Plan d’abonnements',
        accessor: 'nom_plan',
      },
      {
        Header: 'Tarif',
        accessor: 'prix',
        Cell: ({ value }) => `${value} DA`,
      },
      {
        Header: 'Durée',
        accessor: 'duree',
        Cell: ({ value }) => `${value} mois`,
      },
      {
        Header: 'Nombre des SMS',
        accessor: 'nombre_message',
      },
      {
        Header: 'Client',
        accessor: 'plans_clients',
        Cell: ({ value }) => (
          <div>
            {value.map((planClient) => (
              <div className={styles.client} key={planClient.client_id}>{planClient.client.corporation_name}</div>
            ))}
          </div>
        ),
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: ({ row }) => (
          <button onClick={() => visibilityClick(row.original.plan_id)} className={styles.action}>
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
  } = useTable({ columns, data: plans });

  return (
    <div>
      <div className={styles.frame42579} style={{ display: isFrameVisible ? 'block' : 'none' }}>
        <Link
          href={{ pathname: '/modifier_plan', query: { planId: selectedPlanId } }}
          as={`/modifier_plan?planId=${selectedPlanId}`}
          className={styles.frame18}
        >
          <span className={styles.modifierPlan}>Modifier le plan</span>
        </Link>
      </div>
      <table {...getTableProps()} className={styles.clientTableContainer}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className={styles.tableHeader}>
              {headerGroup.headers.map((column) => (                
                <th {...column.getHeaderProps()} className={column.id === 'plans_clients' ? styles.client : styles[column.id]}>
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

export default PlansInterface;
