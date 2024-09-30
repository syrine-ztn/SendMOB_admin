import React, { useState, useEffect } from 'react';
import styles from '../styles/dashboard_interface.module.css';
import Link from 'next/link';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

const DashboardInterface = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalSuccessfulSMS: 0,
    totalFailedSMS: 0,
    totalRevenue: 0,
    monthlyStats: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/statistiques/admin/dashboard', {
          headers: {
            Authorization: `${token}`
          }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    };

    fetchStats();
  }, []);

  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyStats, setMonthlyStats] = useState([]);

  useEffect(() => {
    const fetchMonthlyStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/statistiques/admin/monthly-stats/${year}`, {
          headers: {
            Authorization: `${token}`
          }
        });
        setMonthlyStats(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques mensuelles:', error);
      }
    };

    fetchMonthlyStats();
  }, [year]);

  // Enregistrer les composants ChartJS requis
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip);

  // Tableau contenant les noms des mois
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Données du graphique
  const data = {
    labels: monthlyStats.map(stat => monthNames[stat.month - 1]), // Utilisez les noms des mois au lieu des nombres
    datasets: [
      {
        label: `SMS envoyés en ${year}`,
        data: monthlyStats.map(stat => stat.totalSMS), // Utilisez le nombre total de SMS retourné par l'API comme données
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'SMS Réussis',
        data: monthlyStats.map(stat => stat.successfulSMS), // Utilisez le nombre de SMS réussis retourné par l'API comme données
        backgroundColor: 'rgba(75, 192, 75, 0.2)',
        borderColor: 'rgba(75, 192, 75, 1)',
        borderWidth: 1
      },
      {
        label: 'SMS Échoués',
        data: monthlyStats.map(stat => stat.failedSMS), // Utilisez le nombre de SMS échoués retourné par l'API comme données
        backgroundColor: 'rgba(192, 75, 75, 0.2)',
        borderColor: 'rgba(192, 75, 75, 1)',
        borderWidth: 1
      }
    ]
  };

  const downloadReport = async (format) => {
    if (format === 'pdf') {
      const input = document.getElementById('chart');
      html2canvas(input, { scale: 0.67 })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('landscape');
          pdf.addImage(imgData, 'PNG', 10, 10);
          pdf.save(`rapport_admin_${year}.pdf`);
        })
        .catch((error) => {
          console.error('Erreur lors de la génération du PDF:', error);
        });
    } else if (format === 'csv') {
      const csvRows = [
        ['Mois', 'Total SMS', 'SMS Réussis', 'SMS Échoués'],
        ...monthlyStats.map(stat => [
          monthNames[stat.month - 1],
          stat.totalSMS,
          stat.successfulSMS,
          stat.failedSMS
        ])
      ];

      const csvContent = csvRows.map(e => e.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `rapport_admin_${year}.csv`);
    }
  };

  return (
    <div className={styles.container}>
      <Component1 />
      <Component2 stats={stats} />
      <Component3 year={year} setYear={setYear} data={data} downloadReport={downloadReport} />
    </div>
  );
};

const Component1 = () => {
  return (
    <div className={styles.dashboardInterface}>
      <div className={styles.pageTitle}>Pages / Dashboard</div>
      <div className={styles.statistiques}>Statistiques Générales</div>
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

const Component2 = ({ stats }) => {
  return (
    <div className={styles.frame11}>
      <div className={styles.smallEarnings}>
        <div className={styles.icon}></div>
        <div className={styles.text1}>
          <p className={styles.label1}>Total des clients</p>
          <p className={styles.cash1}>{stats.totalClients}</p>
        </div>
      </div>
      <div className={styles.smallEarnings1}>
        <div className={styles.icon1}></div>
        <div className={styles.text2}>
          <p className={styles.label2}>SMS Réussis</p>
          <p className={styles.cash2}>{stats.totalSuccessfulSMS}</p>
        </div>
      </div>
      <div className={styles.smallEarnings2}>
        <div className={styles.icon2}></div>
        <div className={styles.text3}>
          <p className={styles.label3}>SMS Echoués</p>
          <p className={styles.cash3}>{stats.totalFailedSMS}</p>
        </div>
      </div>
      <div className={styles.smallEarnings2}>
        <div className={styles.icon3}></div>
        <div className={styles.text3}>
          <p className={styles.label3}>Revenue total</p>
          <p className={styles.cash3}>{stats.totalRevenue} DA</p>
        </div>
      </div>
    </div>
  );
};

const Component3 = ({ year, setYear, data, downloadReport }) => {
  const handleChangeYear = (e) => {
    setYear(e.target.value);
  };

  const handleDownloadPDF = () => {
    downloadReport('pdf');
  };

  const handleDownloadCSV = () => {
    downloadReport('csv');
  };

  return (
    <div className={styles.large}>
      <div className={styles.frame78}>
        <div className={styles.timelineButton}>
          <div className={styles.timelineButtonIcon}></div>
          <p className={styles.timelineButtonText}>Année:</p>
          <select className={styles.timelineButtonText2} value={year} onChange={handleChangeYear}>
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className={styles.buttonLink} onClick={handleDownloadPDF}>
          <div className={styles.button}>
            <div className={styles.buttonIcon}></div>
            <p className={styles.buttonText}>Télécharger PDF</p>
          </div>
        </div>
        <div className={styles.buttonLink2} onClick={handleDownloadCSV}>
          <div className={styles.button}>
            <div className={styles.buttonIcon}></div>
            <p className={styles.buttonText}>Télécharger CSV</p>
          </div>
        </div>
      </div>
      <div className={styles.group156} id="chart">
        <Component4 data={data} />
      </div>
    </div>
  );
};

const Component4 = ({ data }) => {
  return (
    <div className={styles.graph}>
      <Bar
        data={data}
        options={{
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            },
            x: {
              type: 'category',
              position: 'bottom'
            }
          }
        }}
      />
    </div>
  );
};

export default DashboardInterface;
