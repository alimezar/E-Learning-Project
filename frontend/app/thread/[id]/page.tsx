// app/thread/[id]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const ThreadPage = () => {
  const { id } = useParams();  // Extract 'id' from the URL

  const [thread, setThread] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch thread data using the dynamic ID
  const fetchThread = async () => {
    if (!id) return; // Return early if id is not yet available
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/threads/thread/${id}`); // Use dynamic ID in URL
      if (!res.ok) {
        throw new Error('Failed to fetch thread');
      }
      const data = await res.json();
      setThread(data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching thread');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThread();
  }, [id]); // Run this effect whenever the 'id' changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!thread) return <p>Thread not found.</p>;

  return (
    <div>
      <h1>{thread.title}</h1>
      <p>{thread.content}</p>
      <p>Course ID: {thread.courseId}</p>
      <p>Created At: {new Date(thread.createdAt).toLocaleString()}</p>
      <p>Updated At: {new Date(thread.updatedAt).toLocaleString()}</p>
    </div>
  );
};

export default ThreadPage;
