'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InstructorDashboard() {
  const [taughtCourses, setTaughtCourses] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaughtCourses = async () => {
      try {
        const response = await fetch('http://localhost:3001/courses/taught', {
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setTaughtCourses(data);
        } else {
          setError(data.message || 'Failed to fetch taught courses.');
        }
      } catch (error) {
        console.error('Error fetching taught courses:', error);
        setError('An error occurred while fetching courses. Please try again later.');
      }
    };

    fetchTaughtCourses();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Instructor Dashboard</h1>
        <Link href="/courses/create" style={styles.createCourseLink}>
          Create New Course
        </Link>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.courseGrid}>
        {taughtCourses.length > 0 ? (
          taughtCourses.map((course) => (
            <div key={course._id} style={styles.courseCard}>
              <h2 style={styles.courseTitle}>{course.title}</h2>
              <p style={styles.courseDescription}>{course.description}</p>
              <Link href={`/courses/${course._id}`} style={styles.courseLink}>
                View Course
              </Link>
            </div>
          ))
        ) : (
          <p>No courses found. Start by creating a new course.</p>
        )}
      </div>
    </div>
  );
}

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
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  createCourseLink: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4c9aff',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  courseCard: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
