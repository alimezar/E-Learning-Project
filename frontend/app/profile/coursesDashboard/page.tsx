'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficultyLevel: string;
  createdBy: string;
}

export default function CoursesDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const cookies = document.cookie.split('; ');
        const userCookie = cookies.find((cookie) => cookie.startsWith('user='));
        if (!userCookie) throw new Error('User not logged in.');

        const userId = JSON.parse(decodeURIComponent(userCookie.split('=')[1])).id;

        const response = await fetch(
          `http://localhost:3001/users/${userId}/enrolled-courses`
        );
        if (!response.ok) throw new Error('Failed to fetch courses.');

        const data = await response.json();
        setCourses(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleCourseClick = (courseId: string) => {
    router.push(`/profile/coursesDashboard/resources?courseId=${courseId}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Enrolled Courses</h1>
      {courses.length === 0 ? (
        <p>You are not enrolled in any courses.</p>
      ) : (
        <div style={styles.grid}>
          {courses.map((course) => (
            <div
              key={course._id}
              style={styles.card}
              onClick={() => handleCourseClick(course._id)}
            >
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <p>Category: {course.category}</p>
              <p>Difficulty: {course.difficultyLevel}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  card: {
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.3s',
  },
};
