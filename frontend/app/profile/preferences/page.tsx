'use client';

import { useState, useEffect } from 'react';

const courseKeywords = ['JavaScript', 'Python', 'Data Science', 'React', 'AI', 'Machine Learning'];

export default function PreferencesPage() {
  const [preferredCourses, setPreferredCourses] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Load preferred courses from localStorage
    const storedCourses = JSON.parse(localStorage.getItem('preferredCourses') || '[]');
    setPreferredCourses(storedCourses);
  }, []);

  const handleToggleCourse = (course: string) => {
    setPreferredCourses((prev) => {
      const updatedCourses = prev.includes(course)
        ? prev.filter((item) => item !== course)
        : [...prev, course];
      localStorage.setItem('preferredCourses', JSON.stringify(updatedCourses));
      return updatedCourses;
    });
  };

  const handleRequestInstructor = async () => {
    setIsRequesting(true);
    try {
      const response = await fetch('http://localhost:3001/users/request-instructor', {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
      });

      if (response.ok) {
        setSuccess('Your request to become an instructor has been sent successfully.');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to send request.');
      }
    } catch (err) {
      console.error('Error sending instructor request:', err);
      setError('An error occurred while sending your request.');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Preferences</h1>
      <p>Customize your learning preferences here.</p>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Preferred Courses</h2>
        <ul style={styles.keywordList}>
          {courseKeywords.map((keyword) => (
            <li key={keyword} style={styles.keywordItem}>
              <label>
                <input
                  type="checkbox"
                  checked={preferredCourses.includes(keyword)}
                  onChange={() => handleToggleCourse(keyword)}
                  style={styles.checkbox}
                />
                {keyword}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Become an Instructor</h2>
        <button
          style={styles.requestButton}
          onClick={handleRequestInstructor}
          disabled={isRequesting}
        >
          {isRequesting ? 'Sending Request...' : 'Request to Become an Instructor'}
        </button>
        {success && <p style={styles.success}>{success}</p>}
        {error && <p style={styles.error}>{error}</p>}
      </section>
    </div>
  );
}

const styles = {
  container: { maxWidth: 600, margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif' },
  title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' },
  section: { marginBottom: '2rem' },
  subtitle: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' },
  keywordList: { listStyleType: 'none', padding: 0 },
  keywordItem: { marginBottom: '0.5rem' },
  checkbox: { marginRight: '0.5rem' },
  requestButton: { padding: '0.5rem 1rem', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  success: { color: 'green', marginTop: '1rem' },
  error: { color: 'red', marginTop: '1rem' },
};
