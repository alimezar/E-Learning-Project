'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const NavBar = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>(''); // Track the user's ID

  // Fetch notifications for the logged-in user
  const fetchNotifications = async () => {
    const cookies = document.cookie;
    const userCookie = cookies.split('; ').find((cookie) => cookie.startsWith('user='));
    if (!userCookie) return; // If user is not logged in, do not fetch notifications

    const user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
    setUserId(user.id); // Store the user ID for dynamic routing

    try {
      const res = await fetch(`http://localhost:3001/notifications/${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch notifications');

      const data = await res.json();
      setNotifications(data);
      setUnreadCount(data.filter((notification: any) => !notification.read).length);
    } catch (error) {
      console.error(error);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`http://localhost:3001/notifications/mark-as-read/${notificationId}`, {
        method: 'POST',
      });

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav style={styles.nav}>
      <Link href="/" style={styles.link}>
        Home
      </Link>
      <Link href="/auth/register" style={styles.link}>
        Register
      </Link>
      <Link href="/auth/login" style={styles.link}>
        Login
      </Link>
      {userId && (
        <Link href={`/chat/${userId}`} style={styles.link}>
          Chat
        </Link>
      )}


      <div style={styles.notificationWrapper}>
        <button onClick={toggleDropdown} style={styles.notificationButton}>
          Notifications {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
        </button>
        {dropdownOpen && (
          <div style={styles.dropdown}>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification._id} style={styles.notificationItem}>
                  <p>{notification.message}</p>
                  {!notification.read && (
                    <button
                      style={styles.markAsReadButton}
                      onClick={() => markAsRead(notification._id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No notifications</p>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    margin: '0 10px',
  },
  notificationWrapper: {
    position: 'relative' as 'relative',
  },
  notificationButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1em',
  },
  badge: {
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 8px',
    marginLeft: '5px',
    fontSize: '0.9em',
  },
  dropdown: {
    position: 'absolute' as 'absolute',
    top: '100%',
    right: '0',
    backgroundColor: 'white',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '300px',
    zIndex: 1000,
  },
  notificationItem: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  markAsReadButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default NavBar;
