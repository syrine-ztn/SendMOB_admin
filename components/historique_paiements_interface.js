import React, { useState, useEffect } from 'react';
import styles from '../styles/historique_paiements_interface.module.css';
import Link from 'next/link';
import axios from 'axios';
import { useTable } from 'react-table';
import { useRouter } from 'next/router';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const HistoriquePaiementsInterface = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response1 = await axios.get(`http://localhost:8000/transactions/getAllTransactionsForClient/${userId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const response = await axios.get(`http://localhost:8000/transactions/getAllTransactionsForClient/${userId}/${page}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setTransactions(response.data);

        const totalCount = response1.data.length;
        const transactionsPerPage = 10;
        const totalPagesCount = Math.ceil(totalCount / transactionsPerPage);
        setTotalPages(totalPagesCount);
      } catch (error) {
        console.error('Erreur lors de la récupération des transactions:', error);
      }
    };

    fetchData();
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
      <HistoriqueTable data={transactions} userId={userId} />
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
      <div className={styles.pageTitle}>Pages / Clients / Historique de paiement</div>
      <div className={styles.statistiques}>Historique de paiement</div>
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

const HistoriqueTable = ({ data, userId }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID de transaction',
        accessor: 'transaction_id',
      },
      {
        Header: 'Méthode de paiement',
        accessor: 'methode_paiement',
      },
      {
        Header: 'Montant payé',
        accessor: 'montant_paye',
        Cell: ({ value }) => <div className={styles.montant_paye}>{value} DA</div>,
      },
      {
        Header: 'Date de paiement',
        accessor: 'date_paiement',
      },
      {
        Header: 'Facture',
        accessor: 'facture',
        Cell: ({ row }) => (
          <button onClick={() => factureClick(row.original, userId)} className={styles.facture}>
            Facture
          </button>
        ),
      },
      {
        Header: 'Statut de transaction',
        accessor: 'status_transaction',
        Cell: ({ row }) => (
          <div className={`${styles.status_transaction} ${row.original.status_transaction === 'payé' ? styles.paye : styles.suspendu}`}>
            {row.original.status_transaction}
          </div>
        ),
      },
      {
        Header: 'Plan',
        accessor: 'plan.nom_plan',
        Cell: ({ value }) => <div className={styles.nomPlan}>{value || 'N/A'}</div>,
      }
    ],
    []
  );

  const factureClick = async (rowData, userId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:8000/plans/getPlanById/${rowData.plan_id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const plan = response.data;
      const client = plan.plans_clients[0]?.client;

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text('Facture', 14, 20);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Détails de la transaction', 14, 32);
      doc.setFont('helvetica', 'normal');
      doc.text(`ID de transaction: ${rowData.transaction_id}`, 14, 38);
      doc.text(`Méthode de paiement: ${rowData.methode_paiement}`, 14, 44);
      doc.text(`Date de paiement: ${rowData.date_paiement}`, 14, 50);

      doc.setFont('helvetica', 'bold');
      doc.text('Détails du plan', 14, 60);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nom du plan: ${plan.nom_plan}`, 14, 66);
      doc.text(`Prix du plan: ${plan.prix} DA`, 14, 72);
      doc.text(`Durée du plan: ${plan.duree} mois`, 14, 78);
      doc.text(`Nombre de messages: ${plan.nombre_message}`, 14, 84);

      doc.setFont('helvetica', 'bold');
      doc.text('Détails du client', 14, 94);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nom de la corporation: ${client?.corporation_name}`, 14, 100);

      doc.autoTable({
        startY: 110,
        head: [['Id transaction', 'Nom du plan', 'Quantité', 'Prix unitaire', 'Prix total']],
        body: [
          [rowData.transaction_id, plan.nom_plan, '1', `${plan.prix} DA`, `${rowData.montant_paye} DA`],
        ],
      });

       // Ajout de la ligne statique Montant total
        doc.setFont('helvetica', 'bold');
        doc.text('Montant total:', 14, doc.previousAutoTable.finalY + 10);
        doc.setFont('helvetica', 'normal');
        doc.text(`${rowData.montant_paye} DA`, 50, doc.previousAutoTable.finalY + 10);

      doc.save(`facture_${rowData.transaction_id}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la récupération du plan:', error);
    }
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div>
      <table {...getTableProps()} className={styles.historiqueTableContainer}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className={styles.tableHeader}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className={column.id === 'plan.nom_plan' ? styles.nomPlan : styles[column.id]}>
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

export default HistoriquePaiementsInterface;
