'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Course {
    _id: string;
    title: string;
    description: string;
    category: string;
    difficultyLevel: string;
    createdBy: string;
  }

export default function UserCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState('');
    const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userCookie = document.cookie.split('; ').find((cookie) => cookie.startsWith('user='));
        const userId = userCookie ? JSON.parse(decodeURIComponent(userCookie.split('=')[1])).id : null;

        if (!userId) throw new Error('User not logged in.');

        const response = await fetch(`http://localhost:3001/courses/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch courses.');

        const data = await response.json();
        setCourses(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchCourses();
  }, []);

  const navigateToCourse = (courseId: string) => {
    router.push(`/profile/courses/${courseId}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Courses</h1>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.grid}>
        {courses.map((course) => (
          <div key={course._id} style={styles.card} onClick={() => navigateToCourse(course._id)}>
            <h3 style={styles.cardTitle}>{course.title}</h3>
            <p style={styles.cardDescription}>{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', fontFamily: 'Arial, sans-serif' },
  title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' },
  error: { color: 'red' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' },
  card: { padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' },
  cardTitle: { fontSize: '1.5rem', fontWeight: 'bold' },
  cardDescription: { fontSize: '1rem', color: '#555' },
};
