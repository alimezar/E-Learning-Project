'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Module {
  _id: string;
  title: string;
  description: string;
}

export default function ModulesPage() {
  const params = useParams();
  const courseId = params?.courseId;
  const router = useRouter();

  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setError('Course ID is missing.');
      return;
    }

    async function fetchModules() {
      try {
        const response = await fetch(`http://localhost:3001/courses/${courseId}/modules`, {
          credentials: 'include',
        });
        const data = await response.json();

        if (response.ok) {
          setModules(data);
        } else {
          setError(data.message || 'Failed to fetch modules.');
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
        setError('An error occurred while fetching modules.');
      }
    }

    fetchModules();
  }, [courseId]);

  async function deleteModule(moduleId: string) {
    try {
      const response = await fetch(`http://localhost:3001/modules/${moduleId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        alert('Module deleted successfully.');
        setModules(modules.filter((module) => module._id !== moduleId));
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete module.');
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      alert('An error occurred while deleting the module.');
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Modules</h1>
      {error && <p style={styles.error}>{error}</p>}
      <ul style={styles.moduleList}>
        {modules.map((module) => (
          <li key={module._id} style={styles.moduleCard}>
            <h3 style={styles.moduleTitle}>{module.title}</h3>
            <p style={styles.moduleDescription}>{module.description}</p>
            <div style={styles.buttonGroup}>
              <button
                onClick={() =>
                  router.push(`/profile/instructor/courses/modules/${courseId}/update/${module._id}`)
                }
                style={styles.updateButton}
              >
                Update
              </button>
              <button
                onClick={() => deleteModule(module._id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
              <button
                onClick={() =>
                  router.push(`/profile/instructor/courses/modules/${courseId}/questions/${module._id}`)
                }
                style={styles.manageQuestionsButton}
              >
                Manage Questions
              </button>
              <button
                onClick={() =>
                  router.push(`/profile/instructor/courses/modules/${courseId}/create-quiz/${module._id}`)
                }
                style={styles.quizButton}
              >
                Create Quiz
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { maxWidth: 800, margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif' },
  title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' as const },
  error: { color: 'red', marginBottom: '1rem', textAlign: 'center' as const },
  moduleList: { listStyle: 'none', padding: 0 },
  moduleCard: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  moduleTitle: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' },
  moduleDescription: { fontSize: '1rem', color: '#555', marginBottom: '1rem' },
  buttonGroup: { 
    display: 'flex', 
    flexDirection: 'column' as const, // Explicitly define as 'column'
    gap: '0.5rem',
  },
  updateButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#2196F3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  manageQuestionsButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#FFC107',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  quizButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

