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
    <div>
      <h1>Update Module</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleUpdateModule}>
        <input
          type="text"
          value={module.title}
          onChange={(e) => setModule({ ...module, title: e.target.value })}
          required
        />
        <textarea
          value={module.description}
          onChange={(e) => setModule({ ...module, description: e.target.value })}
          required
        />
        <input type="file" multiple onChange={(e) => setNewFiles(Array.from(e.target.files || []))} />
        <button type="submit">Update Module</button>
      </form>
    </div>
  );
}
