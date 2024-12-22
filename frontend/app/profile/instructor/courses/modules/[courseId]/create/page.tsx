'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function CreateModulePage() {
  const params = useParams();
  const courseId = params?.courseId;
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateModule(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await fetch(`http://localhost:3001/modules/${courseId}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Module created successfully!');
        router.push(`/profile/instructor/courses/modules/${courseId}`);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create module.');
      }
    } catch (error) {
      console.error('Error creating module:', error);
      setError('An error occurred while creating the module.');
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create Module</h1>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleCreateModule} style={styles.form}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Module Title"
          style={styles.input}
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Module Description"
          style={styles.textarea}
          required
        />
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          style={styles.fileInput}
        />
        <button type="submit" style={styles.button}>
          Create Module
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: 800, margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif' },
  title: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' as const },
  error: { color: 'red', marginBottom: '1rem', textAlign: 'center' as const },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '1rem', borderRadius: '4px', border: '1px solid #ccc' },
  textarea: { padding: '1rem', borderRadius: '4px', border: '1px solid #ccc' },
  fileInput: { padding: '0.5rem' },
  button: { padding: '1rem 2rem', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};
