'use client';
import { useState, useEffect } from 'react';

interface Thread {
  _id: string;
  title: string;
  content: string;
  courseId: string;
  userName: string;
}

const Forum = ({ courseId }: { courseId: string }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newThread, setNewThread] = useState<{ title: string; content: string }>({
    title: '',
    content: '',
  });

  // Fetch threads by courseId
  const fetchThreads = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/threads/${courseId || '12345'}`);
      if (!res.ok) {
        throw new Error('Failed to fetch threads');
      }
      const data = await res.json();
      setThreads(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Error fetching threads');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [courseId]);

  const handleCreateThread = async () => {
    const cookies = document.cookie;
    const userCookie = cookies.split('; ').find((cookie) => cookie.startsWith('user='));
    if (!userCookie) {
      alert('You must be logged in to create a thread.');
      return;
    }

    const user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));

    // Send new thread data including userId to the backend
    const res = await fetch('http://localhost:3001/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newThread.title,
        content: newThread.content,
        courseId: courseId || '12345', // Use dynamic courseId
        userId: user.id, // Pass the userId from the cookie
      }),
    });

    if (res.ok) {
      setNewThread({ title: '', content: '' }); // Clear form after submission
      fetchThreads(); // Reload threads
    } else {
      alert('Failed to create thread');
    }
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f4f4f9',
      padding: '20px',
      borderRadius: '8px',
      width: '80%',
      margin: '0 auto',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    header: {
      fontSize: '2em',
      color: '#333',
      textAlign: 'center' as 'center',  // Corrected type for textAlign
      marginBottom: '20px',
    },
    formContainer: {
      marginTop: '20px',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '1em',
      boxSizing: 'border-box' as 'border-box',  // Fixed boxSizing value
    },
    textarea: {
      width: '100%',
      padding: '12px',
      marginBottom: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '1em',
      boxSizing: 'border-box' as 'border-box',  // Fixed boxSizing value
      height: '150px',
    },
    button: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1.1em',
      textTransform: 'uppercase' as 'uppercase',
    },
    threadList: {
      listStyleType: 'none',
      paddingLeft: '0',
      marginTop: '20px',
    },
    threadItem: {
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      padding: '15px',
      marginBottom: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    },
    link: {
      color: '#007bff',
      textDecoration: 'none',
      fontSize: '1.1em',
      display: 'inline-block',
      marginTop: '10px',
    },
  };
  
  
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Forum</h1>

      {/* Loading and error feedback */}
      {loading && <p>Loading threads...</p>}
      {error && <p>{error}</p>}

      {/* Create Thread Form */}
      <div style={styles.formContainer}>
        <h2>Create a New Thread</h2>
        <input
          type="text"
          placeholder="Thread Title"
          value={newThread.title}
          onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
          style={styles.input}
        />
        <textarea
          placeholder="Thread Content"
          value={newThread.content}
          onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
          style={styles.textarea}
        />
        <button onClick={handleCreateThread} style={styles.button}>
          Create Thread
        </button>
      </div>

      <ul style={styles.threadList}>
        {threads.length > 0 ? (
          threads.map((thread) => (
            <li key={thread._id} style={styles.threadItem}>
              <p>
                <strong>{thread.title}</strong> by {thread.userName}
              </p>
              <a href={`/thread/${thread._id}`} style={styles.link}>
                View Thread
              </a>
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
