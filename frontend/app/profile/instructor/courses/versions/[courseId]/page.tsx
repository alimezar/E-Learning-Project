'use client';

import { useState, useEffect } from 'react';

export default function CourseVersions({ params }: { params: { courseId: string } }) {
  const [versions, setVersions] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const { courseId } = params;

  useEffect(() => {
    // Fetch course versions
    async function fetchVersions() {
      try {
        const response = await fetch(`http://localhost:3001/courses/${courseId}/versions`, {
          credentials: 'include',
        });
        const data = await response.json();

        if (response.ok) {
          setVersions(data);
        } else {
          setError(data.message || 'Failed to fetch course versions.');
        }
      } catch (error) {
        console.error('Error fetching versions:', error);
        setError('An error occurred while fetching versions.');
      }
    }

    fetchVersions();
  }, [courseId]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Course Versions</h1>
      {error && <p style={styles.error}>{error}</p>}
      {versions.length > 0 ? (
        <div style={styles.versionList}>
          {versions.map((version, index) => (
            <div key={index} style={styles.versionCard}>
              <h3 style={styles.versionTitle}>Version {index + 1}</h3>
              <p style={styles.versionDetail}><strong>Title:</strong> {version.title}</p>
              <p style={styles.versionDetail}><strong>Description:</strong> {version.description}</p>
              <p style={styles.versionDetail}><strong>Category:</strong> {version.category}</p>
              <p style={styles.versionDetail}><strong>Difficulty Level:</strong> {version.difficultyLevel}</p>
              <p style={styles.versionDetail}><strong>Last Updated:</strong> {new Date(version.updatedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No previous versions found.</p>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 800, margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif' },
  title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' },
  error: { color: 'red', marginBottom: '1rem' },
  versionList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  versionCard: { backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' },
  versionTitle: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' },
  versionDetail: { fontSize: '1rem', marginBottom: '0.5rem' },
};
