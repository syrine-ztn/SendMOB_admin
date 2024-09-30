import React, { useState, useEffect } from 'react';
import styles from '../styles/notifications_interface.module.css';
import Link from 'next/link';
import axios from 'axios';

const NotificationsInterface = () => {
  return (
    <div className={styles.container}>
      <Component1 />
      <Component2 />
    </div>
  );
};

const Component1 = () => {
  return ( 
    <div className={styles.dashboardInterface}>
      <div className={styles.pageTitle}>Pages / Notifications</div>
      <div className={styles.statistiques}>Notifications</div>
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
                <Link href="/notifications" className={styles.notificationLink}>
                  {/* Add any link content here */}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Component2 = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
        const response = await axios.get('http://localhost:8000/notifications/admin/getNotifications', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setNotifications(response.data.reverse());
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.put(`http://localhost:8000/notifications/admin/updateNotification/${id}`, { : 'oui' }, {
        headers: {vu
          Authorization: `${token}`,
        },
      });

      console.log('Notification updated:', response.data);

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.notification_id === id ? { ...notification, vu: 'oui' } : notification
        )
      );
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  return (
    <div className={styles.frame}>
      {/* Display notifications */}
      {notifications.map((notification) => (
        <div
          key={notification.notification_id}
          className={`${styles['widgets-set']} ${notification.vu === 'oui' ? styles.viewed : styles.notViewed}`}
          onClick={() => handleNotificationClick(notification.notification_id)}
        >
          <div className={styles['emj-branded-frame-32']}>
            <div className={styles.notification2}></div> {/* Placeholder for icon */}
          </div>
          <div className={styles['text-part']}>
            <div className={styles.title}>{notification.type_notification}</div>
            <div className={styles.body}>{notification.contenu}</div>
          </div>
          <div className={styles['additional-info']}>{notification.date_notification}</div> {/* Placeholder for additional info */}
        </div>
      ))}
    </div>
  );
};

export default NotificationsInterface;
