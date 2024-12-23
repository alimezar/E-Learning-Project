'use client';

import NavBar from '@/app/components/NavBar';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function StudentDashboard() {
  const [username, setUsername] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    // Extract the 'user' cookie
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find((cookie) => cookie.startsWith('user='));

    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        setUsername(userData.name);
      } catch (error) {
        console.error('Failed to parse user cookie:', error);
        setUsername('Guest'); // Fallback to guest
      }
    } else {
      setUsername('Guest'); // Default for unauthenticated users
    }
  }, []);

  useEffect(() => {
    // Fetch courses from the backend
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3001/courses', { credentials: 'include' });
        const data = await response.json();

        if (response.ok) {
          setCourses(data);
        } else {
          console.error('Error fetching courses:', data.message);
          setError(data.message || 'Failed to fetch courses.');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to fetch courses. Please try again later.');
      }
    };

    fetchCourses();
  }, []);

  return (
    
    <div style={styles.container}>
      <NavBar/>


      
      {/* Top Section: Welcome Message and Navbar */}
      <div style={styles.header}>
        <div style={styles.welcome}>{username ? `Welcome, ${username}` : 'Loading...'}</div>

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
            <a href="/profile/coursesDashboard" style={styles.dropdownLink}>
              Course Dashboard
            </a>
            <a href="/profile/preferences" style={styles.dropdownLink}>
              Preferences
            </a>
            <a href="/profile/settings" style={styles.dropdownLink}>
              Settings
            </a>
          </div>
        </div>
      </div>

      {/* Main Content: Student-specific Content */}
      <div style={styles.mainContent}>
        <h2 style={styles.sectionTitle}>
          Explore Courses <Link href="/courses" style={{ color: 'blue', textDecoration: 'underline' }}>Here!</Link>
        </h2>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.courseGrid}>
          {courses.length > 0 ? (
             courses.slice(0, 3).map((course) => (
              <div key={course._id} style={styles.courseCard}>
                <h3 style={styles.courseTitle}>{course.title}</h3>
                <p style={styles.courseDescription}>{course.description}</p>
                <p style={styles.courseInstructor}>Instructor: {course.createdBy}</p>
              </div>
            ))
          ) : (
            <p>No courses available.</p>
          )}
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
  courseInstructor: {
    fontSize: '1rem',
    color: '#777',
    marginBottom: '1rem',
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
  error: {
    color: 'red',
    marginBottom: '1rem',
  },
};
