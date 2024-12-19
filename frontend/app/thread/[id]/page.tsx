'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import NavBar from '@/app/components/NavBar';

const ThreadPage = () => {
  const { id } = useParams(); // Extract 'id' from the URL

  const [thread, setThread] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newReply, setNewReply] = useState<string>('');

  // Fetch thread data
  const fetchThread = async () => {
    if (!id) return; // Return early if id is not yet available
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/threads/thread/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch thread');
      }
      const data = await res.json();
      setThread(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Error fetching thread');
      setLoading(false);
    }
  };

  // Fetch replies for the thread
  const fetchReplies = async () => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:3001/replies/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch replies');
      }
      const data = await res.json();
      setReplies(data);
    } catch (error) {
      console.error(error);
      setError('Error fetching replies');
    }
  };

  // Post a new reply
  const postReply = async () => {
    const cookies = document.cookie;
    const userCookie = cookies.split('; ').find((cookie) => cookie.startsWith('user='));
    if (!userCookie) {
      alert('You must be logged in to post a reply.');
      return;
    }

    const user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
    try {
      const res = await fetch(`http://localhost:3001/replies/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newReply,
          userId: user.id,
        }),
      });

      if (res.ok) {
        setNewReply(''); // Clear reply input after successful submission
        fetchReplies(); // Reload replies
      } else {
        alert('Failed to post reply');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while posting the reply');
    }
  };

  useEffect(() => {
    fetchThread();
    fetchReplies();
  }, [id]);

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
      textAlign: 'center' as 'center',
      marginBottom: '20px',
    },
    threadCard: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
    },
    threadTitle: {
      fontSize: '1.5em',
      color: '#333',
      marginBottom: '10px',
    },
    threadContent: {
      fontSize: '1.1em',
      color: '#555',
      lineHeight: '1.6',
      marginBottom: '20px',
    },
    metaData: {
      fontSize: '0.9em',
      color: '#777',
      marginTop: '10px',
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
      boxSizing: 'border-box' as 'border-box',
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
    replyList: {
      listStyleType: 'none',
      paddingLeft: '0',
      marginTop: '20px',
    },
    replyItem: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '15px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    },
    replyContent: {
      fontSize: '1em',
      color: '#555',
      marginBottom: '10px',
    },
    replyMeta: {
      fontSize: '0.9em',
      color: '#777',
    },
  };

  if (loading) return <p style={styles.header}>Loading...</p>;
  if (error) return <p style={styles.header}>{error}</p>;

  if (!thread) return <p style={styles.header}>Thread not found.</p>;

  return (
    <div style={styles.container}>
      <NavBar/>
      <h1 style={styles.header}>Thread Details</h1>

      <div style={styles.threadCard}>
        <h2 style={styles.threadTitle}>{thread.title}</h2>
        <p style={styles.threadContent}>{thread.content}</p>
        <div style={styles.metaData}>
          <p>
            <strong>Course ID:</strong> {thread.courseId}
          </p>
          <p>
            <strong>Author:</strong> {thread.userName}
          </p>
        </div>
      </div>

      {/* Replies */}
      <h2 style={styles.header}>Replies</h2>
      <ul style={styles.replyList}>
        {replies.length > 0 ? (
          replies.map((reply) => (
            <li key={reply._id} style={styles.replyItem}>
              <p style={styles.replyContent}>{reply.content}</p>
              <p style={styles.replyMeta}>
                <strong>By:</strong> {reply.userName} <strong>At:</strong>{' '}
                {new Date(reply.createdAt).toLocaleString()}
              </p>
            </li>
          ))
        ) : (
          <p>No replies yet.</p>
        )}
      </ul>

      {/* Add Reply Form */}
      <div style={styles.formContainer}>
        <h2>Post a Reply</h2>
        <textarea
          placeholder="Write your reply..."
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          style={styles.input}
        />
        <button onClick={postReply} style={styles.button}>
          Submit Reply
        </button>
      </div>
    </div>
  );
};

export default ThreadPage;
