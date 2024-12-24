'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function UpdateModulePage() {
  const params = useParams();
  const moduleId = params?.moduleId;
  const courseId = params?.courseId;
  const router = useRouter();

  const [module, setModule] = useState({
    title: '',
    description: '',
    resources: [] as string[],
    outdatedResources: [] as string[],
  });
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleId) {
      setError('Module ID is missing.');
      return;
    }

    async function fetchModuleDetails() {
      try {
        const response = await fetch(`http://localhost:3001/modules/${moduleId}`, {
          credentials: 'include',
        });
        const data = await response.json();

        if (response.ok) {
          setModule(data);
        } else {
          setError(data.message || 'Failed to fetch module details.');
        }
      } catch (error) {
        console.error('Error fetching module details:', error);
        setError('An error occurred while fetching module details.');
      }
    }

    fetchModuleDetails();
  }, [moduleId]);

  async function handleMarkOutdated(resource: string) {
    try {
      const response = await fetch(
        `http://localhost:3001/modules/${moduleId}/mark-outdated`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ resource }),
        }
      );

      if (response.ok) {
        alert('Resource marked as outdated.');
        setModule((prevModule) => ({
          ...prevModule,
          outdatedResources: [
            ...(prevModule.outdatedResources || []),
            resource,
          ],
        }));
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to mark resource as outdated.');
      }
    } catch (err) {
      console.error('Error marking resource as outdated:', err);
      alert('An error occurred while marking the resource as outdated.');
    }
  }

  async function handleUpdateModule(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', module.title);
    formData.append('description', module.description);
    newFiles.forEach((file) => formData.append('files', file));

    try {
      const response = await fetch(`http://localhost:3001/modules/${moduleId}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        alert('Module updated successfully!');
        router.push(`/profile/instructor/courses/modules/${courseId}`);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update module.');
      }
    } catch (error) {
      console.error('Error updating module:', error);
      setError('An error occurred while updating the module.');
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Update Module</h1>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleUpdateModule} style={styles.form as React.CSSProperties}>
        <label style={styles.label}>
          Title:
          <input
            type="text"
            value={module.title}
            onChange={(e) => setModule({ ...module, title: e.target.value })}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Description:
          <textarea
            value={module.description}
            onChange={(e) => setModule({ ...module, description: e.target.value })}
            required
            style={styles.textarea}
          />
        </label>
        <label style={styles.label}>
          Resources:
          {module.resources.map((resource, index) => (
            <div key={index} style={styles.resourceItem}>
              <span>{resource}</span>
              {module.outdatedResources?.includes(resource) ? (
                <span style={styles.outdatedLabel}>Outdated</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleMarkOutdated(resource)}
                  style={styles.outdatedButton}
                >
                  Mark as Outdated
                </button>
              )}
            </div>
          ))}
          <input
            type="file"
            multiple
            onChange={(e) => setNewFiles(Array.from(e.target.files || []))}
            style={styles.fileInput}
          />
        </label>
        <button type="submit" style={styles.button}>
          Update Module
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: '600px', margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif' },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textAlign: 'center' as const,
    color: '#333',
  },
  error: { color: 'red', marginBottom: '1rem', textAlign: 'center' as const },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '1rem' },
  label: { fontWeight: 'bold', color: '#555', marginBottom: '0.5rem' },
  resourceItem: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' },
  outdatedLabel: { color: 'red', fontWeight: 'bold' },
  outdatedButton: {
    padding: '0.5rem',
    backgroundColor: '#f44336',
    color: '#fff',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  },
  input: { padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' },
  textarea: { padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px', width: '100%' },
  fileInput: { padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' },
  button: { padding: '0.75rem', fontSize: '1rem', borderRadius: '4px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s ease' },
};
