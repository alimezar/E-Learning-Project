'use client';

import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    // Extract the 'user' cookie
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find((cookie) => cookie.startsWith('user='));

    if (userCookie) {
      try {
        // Parse the user cookie
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        setUsername(userData.name);
      } catch (error) {
        console.error('Failed to parse user cookie:', error);
      }
    } else {
      setUsername('Guest'); // Default for unauthenticated users
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* Top Section: Welcome Message and Navbar */}
      <div style={styles.header}>
        <div style={styles.welcome}>
          {username ? `Welcome, ${username}` : 'Loading...'}
        </div>

        {/* Dropdown Nav Bar */}
        <div
          style={styles.navbar}
          onMouseEnter={() => setDropdownVisible(true)}
          onMouseLeave={() => setDropdownVisible(false)}
        >
          <button style={styles.dropbtn}>☰</button>
          <div
            style={{
              ...styles.dropdownContent,
              ...(dropdownVisible ? styles.dropdownContentVisible : {}),
            }}
          >
            <a href="/profile/preferences" style={styles.dropdownLink}>
              Preferences
            </a>
            <a href="/profile/settings" style={styles.dropdownLink}>
              Settings
            </a>
          </div>
        </div>
      </div>

      {/* Main Content: Courses Section */}
      <div style={styles.mainContent}>
        <h2 style={styles.sectionTitle}>Explore Courses</h2>
        <div style={styles.courseGrid}>
          {/* Example cards */}
          <div style={styles.courseCard}>
            <h3 style={styles.courseTitle}>Intro to Programming</h3>
            <p style={styles.courseDescription}>
              Learn the basics of programming with this beginner-friendly course.
            </p>
            <a href="/courses" style={styles.courseLink}>
              View Course
            </a>
          </div>

          <div style={styles.courseCard}>
            <h3 style={styles.courseTitle}>Web Development</h3>
            <p style={styles.courseDescription}>
              Build modern websites with HTML, CSS, and JavaScript.
            </p>
            <a href="/courses" style={styles.courseLink}>
              View Course
            </a>
          </div>

          <div style={styles.courseCard}>
            <h3 style={styles.courseTitle}>Data Science</h3>
            <p style={styles.courseDescription}>
              Dive into the world of data and analytics with Python.
            </p>
            <a href="/courses" style={styles.courseLink}>
              View Course
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline Styles
const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    borderBottom: '1px solid #ddd',
    paddingBottom: '1rem',
  },
  welcome: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  navbar: {
    position: 'relative' as const,
  },
  dropbtn: {
    backgroundColor: '#4c9aff',
    color: 'white',
    padding: '0.5rem 1rem',
    fontSize: '1.2rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  dropdownContent: {
    display: 'none',
    position: 'absolute' as const,
    right: 0,
    backgroundColor: '#f9f9f9',
    minWidth: '160px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    zIndex: 1,
  },
  dropdownContentVisible: {
    display: 'block',
  },
  dropdownLink: {
    color: 'black',
    padding: '12px 16px',
    textDecoration: 'none',
    display: 'block',
  },
  mainContent: {
    marginTop: '2rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  courseCard: {
    backgroundColor: '#f4f4f4',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s',
  },
  courseCardHover: {
    transform: 'scale(1.05)',
  },
  courseTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  courseDescription: {
    fontSize: '1rem',
    marginBottom: '1rem',
    color: '#555',
  },
  courseLink: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    backgroundColor: '#4c9aff',
    color: 'white',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};
