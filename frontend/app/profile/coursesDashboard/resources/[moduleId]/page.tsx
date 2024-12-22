'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ModuleDetails() {
  const params = useParams();
  const moduleId = params?.moduleId;

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
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{module.title}</h1>
      <p style={styles.description}>{module.description}</p>

      <h2 style={styles.subtitle}>Resources</h2>
      <ul style={styles.resourceList}>
        {module.resources.map((resource, index) => (
          <li key={index}>
            <a href={resource} download target="_blank" rel="noopener noreferrer">
              Download Resource {index + 1}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { maxWidth: 800, margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif' },
  title: { fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold' },
  description: { marginBottom: '2rem', fontSize: '1.2rem' },
  subtitle: { fontSize: '1.5rem', marginBottom: '1rem' },
  resourceList: { listStyleType: 'none', padding: 0 },
};
