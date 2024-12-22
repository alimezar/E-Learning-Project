'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface MultimediaResource {
  title: string;
  type: string; // e.g., "video", "PDF", etc.
  url: string;
}

interface Module {
  _id: string;
  title: string;
  content: string;
  resources: string[]; // URLs or IDs of resources
}

export default function Resources() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  const [resources, setResources] = useState<MultimediaResource[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        if (!courseId) throw new Error('Course ID not provided.');

        // Fetch multimedia resources
        const resourcesResponse = await fetch(`http://localhost:3001/courses/${courseId}/resources`);
        if (!resourcesResponse.ok) throw new Error('Failed to fetch multimedia resources.');
        const multimediaResources = await resourcesResponse.json();

        // Fetch modules
        const modulesResponse = await fetch(`http://localhost:3001/courses/${courseId}/modules/details`);
        if (!modulesResponse.ok) throw new Error('Failed to fetch modules.');
        const modulesData = await modulesResponse.json();

        setResources(multimediaResources);
        setModules(modulesData.modules);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  const findResourceDetails = (url: string) => {
    return resources.find((res) => res.url === url);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Course Resources</h1>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Multimedia Resources</h2>
        {resources.length === 0 ? (
          <p>No multimedia resources available for this course.</p>
        ) : (
          <ul style={styles.list}>
            {resources.map((resource, index) => (
              <li key={index} style={styles.listItem}>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  {resource.title} ({resource.type})
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Modules</h2>
        {modules.length === 0 ? (
          <p>No modules available for this course.</p>
        ) : (
          modules.map((module) => (
            <div key={module._id} style={styles.moduleCard}>
              <h3>{module.title}</h3>
              <p>{module.content}</p>
              <ul>
                {module.resources.map((resource, index) => {
                  const resourceDetails = findResourceDetails(resource);
                  return (
                    <li key={index}>
                      {resourceDetails ? (
                        <a href={resourceDetails.url} target="_blank" rel="noopener noreferrer">
                          {resourceDetails.title} ({resourceDetails.type})
                        </a>
                      ) : (
                        <span>{resource}</span> // Fallback for resources without details
                      )}
                    </li>
                  );
                })}
              </ul>
              <button
                style={styles.viewButton}
                onClick={() => alert(`Viewing module: ${module.title}`)}
              >
                View
              </button>
            </div>
          ))
        )}
      </section>

      <button
        style={styles.viewButton}
        onClick={() => window.location.href = `/forum?courseId=${courseId}`}
      >
        Go to Forum
      </button>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', fontFamily: 'Arial, sans-serif' },
  title: { fontSize: '2.5rem', marginBottom: '2rem' },
  section: { marginBottom: '2rem' },
  subtitle: { fontSize: '2rem', marginBottom: '1rem' },
  list: { listStyleType: 'none', padding: 0 },
  listItem: { marginBottom: '1rem' },
  moduleCard: { padding: '1rem', backgroundColor: '#f9f9f9', marginBottom: '1rem' },
  viewButton: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
