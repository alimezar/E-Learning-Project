'use client';

import { useState } from 'react';

export default function CreateCourse() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('Beginner');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Extract user details from the cookie
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

      // API call to create a course
      const response = await fetch('http://localhost:3001/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          category,
          difficultyLevel,
          createdById: instructorId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Course created successfully!');
        setTitle('');
        setDescription('');
        setCategory('');
        setDifficultyLevel('Beginner');

        // Redirect to the instructor dashboard
        window.location.href = '/profile/instructor';
      } else {
        setError(data.message || 'Failed to create course.');
      }
    } catch (err) {
      console.error('Error creating course:', err);
      setError('An error occurred while creating the course.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create a New Course</h1>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
      <form onSubmit={handleCreateCourse} style={styles.form}>
        <label style={styles.label}>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={styles.textarea}
          />
        </label>
        <label style={styles.label}>
          Category:
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Difficulty Level:
          <select
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            style={styles.select}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>
        <button type="submit" style={styles.button}>
          Create Course
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
