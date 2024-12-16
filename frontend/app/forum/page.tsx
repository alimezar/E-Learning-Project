// pages/forum.tsx
'use client';
import { useState, useEffect } from 'react';

interface Thread {
  _id: string;  // MongoDB ObjectId field
  title: string;
  content: string;
  courseId: string;
}

const Forum = ({ courseId }: { courseId: string }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch threads by courseId
  const fetchThreads = async () => {
    try {
      setLoading(true); // Start loading
      const res = await fetch(`http://localhost:3001/threads/12345`); // Adjust URL with courseId
      if (!res.ok) {
        throw new Error('Failed to fetch threads');
      }
      const data = await res.json();
      setThreads(data);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error(error);
      setError('Error fetching threads');
      setLoading(false); // Set loading to false on error
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [courseId]);

  return (
    <div>
      <h1>Forum</h1>

      {/* Loading and error feedback */}
      {loading && <p>Loading threads...</p>}
      {error && <p>{error}</p>}

      <ul>
        {threads.length > 0 ? (
          threads.map((thread) => (
            <li key={thread._id}>
              <a href={`/thread/${thread._id}`}>{thread.title}</a> 
            </li>
          ))
        ) : (
          <p>No threads available.</p>
        )}
      </ul>
    </div>
  );
};

export default Forum;
