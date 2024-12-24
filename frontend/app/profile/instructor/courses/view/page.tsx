'use client';

import { useState, useEffect } from 'react';

interface Course {
  _id: string;
  title: string;
  description: string;
  category?: string;
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  createdBy?: string;
  unavailable?: boolean; 
}

export default function ViewAllCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null); // Track user role

  useEffect(() => {
    // Extract the 'user' cookie
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find((cookie) => cookie.startsWith('user='));

    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        setUserRole(userData.role); // Set user role
      } catch (error) {
        console.error('Failed to parse user cookie:', error);
        setUserRole(null); // Default to null
      }
    } else {
      setUserRole(null); // Default for unauthenticated users
    }
  }, []);


  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('http://localhost:3001/courses', {
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setCourses(data);
        } else {
          setError(data.message || 'Failed to fetch courses.');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('An error occurred while fetching courses.');
      }
    }

    fetchCourses();
  }, []);

  async function handleToggleAvailability(courseId: string) {
    try {
      const response = await fetch(`http://localhost:3001/courses/${courseId}/toggle-availability`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (response.ok) {
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === courseId ? { ...course, unavailable: !course.unavailable } : course
          )
        );
        alert('Course availability status updated.');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update course availability.');
      }
    } catch (error) {
      console.error('Error toggling course availability:', error);
      alert('An error occurred while updating course availability.');
    }
  }

  async function handleUpdate(courseId: string) {
    window.location.href = `/profile/instructor/courses/update/${courseId}`;
  }

  async function handleViewVersions(courseId: string) {
    window.location.href = `/profile/instructor/courses/versions/${courseId}`;
  }

  async function handleDelete(courseId: string) {
    try {
      const response = await fetch(`http://localhost:3001/courses/${courseId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId));
        alert('Course deleted successfully.');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete course.');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('An error occurred while deleting the course.');
    }
  }
  // function getUserRole() {
  //   const userCookie = document.cookie.split('; ').find((cookie) => cookie.startsWith('user='));
  //   return userCookie ? JSON.parse(decodeURIComponent(userCookie.split('=')[1])).role : null;
  // }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>All Courses</h1>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.courseGrid}>
        {courses.map((course) => (
          <div key={course._id} style={styles.courseCard}>
            <h3 style={styles.courseTitle}>{course.title}</h3>
            {course.unavailable && <p style={styles.unavailableTag}>Course Unavailable</p>}
            <p style={styles.courseDescription}>{course.description}</p>
            <p style={styles.courseCategory}>Category: {course.category}</p>
            <p style={styles.courseDifficulty}>Difficulty: {course.difficultyLevel}</p>
            <button
              style={styles.buttonDelete}
              onClick={() => handleToggleAvailability(course._id)}
            >
              {course.unavailable ? 'Mark as Available' : 'Mark as Unavailable'}
            </button>
            <button style={styles.buttonUpdate} onClick={() => handleUpdate(course._id)}>
              Update
            </button>
            <button style={styles.buttonVersions} onClick={() => handleViewVersions(course._id)}>
              Versions
            </button>
            {userRole === 'admin' && (
              <button
                style={styles.buttonDelete}
                onClick={() => handleDelete(course._id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif' },
  title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' },
  error: { color: 'red', marginBottom: '1rem' },
  courseGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' },
  courseCard: { backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' },
  courseTitle: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' },
  courseDescription: { fontSize: '1rem', marginBottom: '0.5rem', color: '#555' },
  courseCategory: { fontSize: '1rem', marginBottom: '0.5rem', color: '#777' },
  courseDifficulty: { fontSize: '1rem', marginBottom: '0.5rem', color: '#777' },
  buttonDelete: { padding: '0.5rem', backgroundColor: 'red', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  buttonUpdate: { padding: '0.5rem', backgroundColor: 'blue', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '0.5rem' },
  buttonVersions: { padding: '0.5rem', backgroundColor: 'green', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '0.5rem' },
  unavailableTag: { color: 'red', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem' },
};
