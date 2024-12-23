'use client';

import { useState, useEffect } from 'react';

export default function UpdateCourse({ params }: { params: { courseId: string } }) {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [course, setCourse] = useState({
    title: '',
    description: '',
    category: '',
    difficultyLevel: 'Beginner',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Set courseId from params dynamically
    if (params.courseId) {
      setCourseId(params.courseId);
    } else {
      setError('Course ID is missing.');
    }
  }, [params]);

  useEffect(() => {
    if (!courseId) return;

    // Fetch course details based on courseId
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

  async function handleUpdateCourse(e: React.FormEvent) {
    e.preventDefault();
  
    if (!courseId) {
      setError('Course ID is missing.');
      console.error('Error: Course ID is missing.');
      return;
    }
  
    console.log('Sending update request:', { courseId, course });
  
    try {
      const response = await fetch(`http://localhost:3001/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(course),
      });
  
      console.log('Received response:', response.status);
  
      const data = await response.json();
      console.log('Response data:', data);
  
      if (response.ok) {
        setSuccess('Course updated successfully!');
        
      } else {
        setError(data.message || 'Failed to update course.');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      setError('An error occurred while updating the course.');
    }
  }
  

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Update Course</h1>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
      <form onSubmit={handleUpdateCourse} style={styles.form}>
        <label style={styles.label}>
          Title:
          <input
            type="text"
            name="title"
            value={course.title}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Description:
          <textarea
            name="description"
            value={course.description}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
        </label>
        <label style={styles.label}>
          Category:
          <input
            type="text"
            name="category"
            value={course.category}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Difficulty Level:
          <select
            name="difficultyLevel"
            value={course.difficultyLevel}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>
        <button type="submit" style={styles.button}>
          Update Course
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: 600, margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif' },
  title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' },
  error: { color: 'red', marginBottom: '1rem' },
  success: { color: 'green', marginBottom: '1rem' },
  form: { display: 'flex', flexDirection: 'column' as 'column', gap: '1rem' },
  label: { fontWeight: 'bold' },
  input: { padding: '0.5rem', fontSize: '1rem', borderRadius: 4, border: '1px solid #ccc', width: '100%' },
  textarea: { padding: '0.5rem', fontSize: '1rem', borderRadius: 4, border: '1px solid #ccc', minHeight: 100, width: '100%' },
  select: { padding: '0.5rem', fontSize: '1rem', borderRadius: 4, border: '1px solid #ccc', width: '100%' },
  button: { padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: 4, backgroundColor: '#4c9aff', color: '#fff', border: 'none', cursor: 'pointer' },
};
