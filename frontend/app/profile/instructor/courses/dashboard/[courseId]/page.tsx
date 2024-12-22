'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function InstructorCourseDashboard() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId;

  const [course, setCourse] = useState({
    title: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    async function fetchCourseDetails() {
      try {
        const response = await fetch(`http://localhost:3001/courses/${courseId}`, {
          credentials: 'include',
        });
        const data = await response.json();

        if (response.ok) {
          setCourse(data);
        } else {
          setError(data.message || 'Failed to fetch course details.');
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError('An error occurred while fetching course details.');
      }
    }

    fetchCourseDetails();
  }, [courseId]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{course.title}</h1>
      <p>{course.description}</p>
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.buttonGroup}>
        <button
          style={styles.button}
          onClick={() => router.push(`/profile/instructor/courses/modules/${courseId}`)}
        >
          View Modules
        </button>
        <button
          style={styles.button}
          onClick={() => router.push(`/profile/instructor/courses/students/${courseId}`)}
        >
          View Students
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 800, margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif' },
  title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' },
  error: { color: 'red', marginBottom: '1rem' },
  buttonGroup: { display: 'flex', gap: '1rem', marginTop: '2rem' },
  button: { padding: '1rem 2rem', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};
