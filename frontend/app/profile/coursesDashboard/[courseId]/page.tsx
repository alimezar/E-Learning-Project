'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Module {
    _id: string;
    title: string;
    content: string;
    resources: string[];
  }

export default function CoursePage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [error, setError] = useState('');
  const { courseId } = useParams();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(`http://localhost:3001/modules/course/${courseId}`);
        if (!response.ok) throw new Error('Failed to fetch modules.');

        const data = await response.json();
        setModules(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchModules();
  }, [courseId]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Course Modules</h1>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.grid}>
        {modules.map((module) => (
          <div key={module._id} style={styles.card}>
            <h3 style={styles.cardTitle}>{module.title}</h3>
            <p style={styles.cardContent}>{module.content}</p>
            <div>
              {module.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  View Resource {index + 1}
                </a>
              ))}
            </div>
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
  card: { padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' },
  cardTitle: { fontSize: '1.5rem', fontWeight: 'bold' },
  cardContent: { fontSize: '1rem', marginBottom: '1rem' },
  link: { color: '#4c9aff', textDecoration: 'none', marginRight: '1rem' },
};
