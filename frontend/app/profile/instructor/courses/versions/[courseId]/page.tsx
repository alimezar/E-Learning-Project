'use client';

import { useState, useEffect } from 'react';

interface Version {
  title: string;
  description: string;
  category?: string;
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  updatedAt?: string;
}

export default function CourseVersions({ params }: { params: { courseId: string } }) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { courseId } = params;

  useEffect(() => {
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
        <div style={{ display: 'flex', flexDirection: 'column' as 'column', gap: '1rem' }}>
          {versions.map((version, index) => (
            <div key={index} style={styles.versionCard}>
              <h3 style={styles.versionTitle}>Version {index + 1}</h3>
              <p><strong>Title:</strong> {version.title}</p>
              <p><strong>Description:</strong> {version.description}</p>
              <p><strong>Category:</strong> {version.category || 'N/A'}</p>
              <p><strong>Difficulty Level:</strong> {version.difficultyLevel || 'N/A'}</p>
              <p><strong>Last Updated:</strong> {version.updatedAt ? new Date(version.updatedAt).toLocaleString() : 'N/A'}</p>
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
  versionCard: { backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' },
  versionTitle: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' },
};
