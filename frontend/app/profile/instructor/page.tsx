'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Course {
  _id: string;
  title: string;
  description: string;
  createdBy?: string;
  createdById?: string;
  category?: string;
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export default function InstructorDashboard() {
  const [username, setUsername] = useState<string>('Guest');
  const [role, setRole] = useState<string | null>(null);
  const [taughtCourses, setTaughtCourses] = useState<Course[]>([]);
  const [teachableCourses, setTeachableCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Extract user details from cookie
  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find((cookie) => cookie.startsWith('user='));

    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        setUsername(userData.name || 'Guest');
        setRole(userData.role); // Set the role (e.g., instructor)
      } catch (error) {
        console.error('Failed to parse user cookie:', error);
        setError('An error occurred while reading user information.');
        setUsername('Guest');
      }
    } else {
      setError('You must be logged in to view this page.');
    }
  }, []);

  // Fetch courses only if the user is an instructor
  useEffect(() => {
    if (role !== 'instructor') {
      return;
    }

    async function fetchTaughtCourses() {
      try {
        // Extract the 'user' cookie
        const cookies = document.cookie.split('; ');
        const userCookie = cookies.find((cookie) => cookie.startsWith('user='));

        if (!userCookie) {
          setError('User information not found. Please log in again.');
          return;
        }

        // Parse the cookie and extract the userId
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        const instructorId = userData.id;

        if (!instructorId) {
          setError('Instructor ID not found. Please log in again.');
          return;
        }

        console.log('Fetching taught courses for instructor:', instructorId);

        const response = await fetch(`http://localhost:3001/courses/taught?instructorId=${instructorId}`, {
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          setTaughtCourses(data);
          setError(null); // Clear error on success
        } else {
          setError(data.message || 'Failed to fetch taught courses.');
        }
      } catch (error) {
        console.error('Error fetching taught courses:', error);
        setError('An error occurred while fetching taught courses.');
      }
    }

    async function fetchTeachableCourses() {
      try {
        const response = await fetch('http://localhost:3001/courses/teachable', {
          credentials: 'include',
        });
        const data = await response.json();

        if (response.ok) {
          setTeachableCourses(data);
        } else {
          setError(data.message || 'Failed to fetch teachable courses.');
        }
      } catch (error) {
        console.error('Error fetching teachable courses:', error);
        setError('An error occurred while fetching teachable courses.');
      }
    }

    fetchTaughtCourses();
    fetchTeachableCourses();
  }, [role]);

  async function assignCourse(courseId: string) {
    try {
      const cookies = document.cookie.split('; ');
      const userCookie = cookies.find((cookie) => cookie.startsWith('user='));

      if (!userCookie) {
        alert('User information not found. Please log in again.');
        return;
      }

      const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
      const instructorId = userData.id;

      if (!instructorId) {
        alert('Instructor ID not found. Please log in again.');
        return;
      }

      console.log('Assigning course with:', { courseId, instructorId });

      const response = await fetch(`http://localhost:3001/courses/assign/${courseId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instructorId }),
      });

      if (response.ok) {
        alert('Course successfully assigned to you!');
        setTeachableCourses(teachableCourses.filter((course) => course._id !== courseId));
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to assign course.');
      }
    } catch (error) {
      console.error('Error assigning course:', error);
      alert('An error occurred while assigning the course.');
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Instructor Dashboard</h1>
        <Link href="/profile/instructor/courses/create" style={styles.createCourseLink}>
          Create New Course
        </Link>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {role === 'instructor' && (
        <>
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Your Taught Courses</h2>
            <div style={styles.courseGrid}>
              {taughtCourses.length > 0 ? (
                taughtCourses.map((course) => (
                  <div key={course._id} style={styles.courseCard}>
                    <h3 style={styles.courseTitle}>{course.title}</h3>
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
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Teachable Courses</h2>
            <div style={styles.courseGrid}>
              {teachableCourses.length > 0 ? (
                teachableCourses.map((course) => (
                  <div key={course._id} style={styles.courseCard}>
                    <h3 style={styles.courseTitle}>{course.title}</h3>
                    <p style={styles.courseDescription}>{course.description}</p>
                    <button style={styles.assignButton} onClick={() => assignCourse(course._id)}>
                      Assign to Me
                    </button>
                  </div>
                ))
              ) : (
                <p>No teachable courses available at the moment.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', fontFamily: 'Arial, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { fontSize: '2rem', fontWeight: 'bold' },
  createCourseLink: { padding: '0.5rem 1rem', backgroundColor: '#4c9aff', color: '#fff', textDecoration: 'none', borderRadius: '4px' },
  error: { color: 'red', marginBottom: '1rem' },
  section: { marginBottom: '2rem' },
  sectionTitle: { fontSize: '1.5rem', marginBottom: '1rem' },
  courseGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' },
  courseCard: { backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' },
  courseTitle: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' },
  courseDescription: { fontSize: '1rem', color: '#555', marginBottom: '1rem' },
  courseLink: { display: 'inline-block', padding: '0.5rem 1rem', backgroundColor: '#4c9aff', color: 'white', borderRadius: '4px', textDecoration: 'none' },
  assignButton: { padding: '0.5rem 1rem', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};
