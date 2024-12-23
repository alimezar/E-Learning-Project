'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ModuleDetails() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params?.moduleId;
  const quizzesId = params?.quizzesId;


  const [module, setModule] = useState({
    title: '',
    description: '',
    resources: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        if (!moduleId) throw new Error('Module ID is missing.');

        const response = await fetch(`http://localhost:3001/modules/${moduleId}`);
        if (!response.ok) throw new Error('Failed to fetch module details.');

        const data = await response.json();
        setModule(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchModuleDetails();
  }, [moduleId]);

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{module.title}</h1>
      <p style={styles.description}>{module.description}</p>

      <h2 style={styles.subtitle}>Resources</h2>
      <ul style={styles.resourceList}>
        {module.resources.map((resource, index) => (
          <li key={index} style={styles.resourceItem}>
            <a href={resource} download target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>
              Download Resource {index + 1}
            </a>
          </li>
        ))}
      </ul>

      <button
        style={styles.quizButton}
        onClick={() => router.push(`/profile/coursesDashboard/resources/${moduleId}/quizzes/${quizzesId}`)}
      >
        Take Quiz
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    color: '#333',
  },
  description: {
    marginBottom: '2rem',
    fontSize: '1.2rem',
    textAlign: 'justify' as const,
    lineHeight: '1.6',
    color: '#555',
  },
  subtitle: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    color: '#333',
    textAlign: 'center' as const,
  },
  resourceList: {
    listStyleType: 'none',
    padding: 0,
    marginBottom: '2rem',
  },
  resourceItem: {
    marginBottom: '0.5rem',
  },
  resourceLink: {
    textDecoration: 'none',
    color: '#007BFF',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  quizButton: {
    display: 'block',
    marginTop: '2rem',
    padding: '1rem 2rem',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    textAlign: 'center' as const,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  quizButtonHover: {
    backgroundColor: '#45A049',
    transform: 'scale(1.02)',
  },
};
