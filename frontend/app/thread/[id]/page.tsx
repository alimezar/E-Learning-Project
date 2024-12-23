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
  const [user, setUser] = useState<any>(null); // To store user info

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
      console.log('Fetched thread data:', data); // Debugging log
      setThread(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Error fetching thread');
      setLoading(false);
    }
  };

  const fetchUserData = () => {
    const cookies = document.cookie;
    const userCookie = cookies.split('; ').find((cookie) => cookie.startsWith('user='));

    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        console.log('Parsed user data:', userData); // Debugging log
        if (userData.id && userData.name && userData.role) {
          setUser(userData);
        } else {
          console.error('Incomplete user data in cookie:', userData);
        }
      } catch (error) {
        console.error('Failed to parse user cookie:', error);
      }
    } else {
      console.error('User cookie not found');
    }
  };

  const handleEditThread = async () => {
    if (!user) return alert('You must be logged in.');

    const updatedTitle = prompt('Enter new title:', thread.title);
    const updatedContent = prompt('Enter new content:', thread.content);

    if (!updatedTitle || !updatedContent) return alert('Title and content cannot be empty.');

    try {
      const res = await fetch(`http://localhost:3001/threads/${thread._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updatedTitle,
          content: updatedContent,
          userId: user.id,
          role: user.role,
        }),
      });

      if (res.ok) {
        fetchThread(); // Refresh thread details
        alert('Thread updated successfully.');
      } else {
        alert('Failed to edit thread.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    }
  };

  const handleDeleteThread = async () => {
    if (!user) return alert('You must be logged in.');

    const confirmDelete = confirm('Are you sure you want to delete this thread?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3001/threads/${thread._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role: user.role }),
      });

      if (res.ok) {
        alert('Thread deleted successfully.');
        window.location.href = '/'; // Redirect to another page after deletion
      } else {
        alert('Failed to delete thread.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    }
  };

  const handleEditReply = async (replyId: string, currentContent: string) => {
    if (!user) return alert('You must be logged in.');
  
    const updatedContent = prompt('Enter new content for your reply:', currentContent);
    if (!updatedContent) return alert('Content cannot be empty.');
  
    try {
      const res = await fetch(`http://localhost:3001/replies/${replyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: updatedContent, userId: user.id, role: user.role }),
      });
  
      if (res.ok) {
        fetchReplies(); // Refresh replies
        alert('Reply updated successfully.');
      } else {
        alert('Failed to update reply.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while updating the reply.');
    }
  };
  
  const handleDeleteReply = async (replyId: string) => {
    if (!user) return alert('You must be logged in.');
  
    const confirmDelete = confirm('Are you sure you want to delete this reply?');
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`http://localhost:3001/replies/${replyId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role: user.role }),
      });
  
      if (res.ok) {
        fetchReplies(); // Refresh replies
        alert('Reply deleted successfully.');
      } else {
        alert('Failed to delete reply.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the reply.');
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
    if (!user) {
      alert('You must be logged in to post a reply.');
      return;
    }
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
    fetchUserData();
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
    button: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1.1em',
      textTransform: 'uppercase' as 'uppercase',
      marginRight: '10px',
    },
    deleteButton: {
      backgroundColor: '#FF0000',
    },
  };

  if (loading) return <p style={styles.header}>Loading...</p>;
  if (error) return <p style={styles.header}>{error}</p>;

  if (!thread) return <p style={styles.header}>Thread not found.</p>;

  return (
    <div style={styles.container}>
      <NavBar />
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
        {user &&
          (user.role === 'admin' ||
            user.role === 'instructor' ||
            user.name === thread.userName) && ( // Check by name for ownership
            <div>
              <button onClick={handleEditThread} style={styles.button}>
                Edit
              </button>
              <button
                onClick={handleDeleteThread}
                style={{ ...styles.button, ...styles.deleteButton }}
              >
                Delete
              </button>
            </div>
          )}
      </div>

      {/* Replies */}
      <h2 style={styles.header}>Replies</h2>
      <ul>
  {replies.map((reply) => (
    <li key={reply._id}>
      <p>
        <strong>{reply.userName}:</strong> {reply.content}
      </p>
      {user && (user.role === 'admin' ||user.role === 'instructor' || user.name === reply.userName) && (
        <div>
          <button
            onClick={() => handleEditReply(reply._id, reply.content)}
            style={styles.button}
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteReply(reply._id)}
            style={{ ...styles.button, ...styles.deleteButton }}
          >
            Delete
          </button>
        </div>
      )}
    </li>
  ))}
</ul>

      {/* Add Reply Form */}
      <textarea
        placeholder="Write your reply..."
        value={newReply}
        onChange={(e) => setNewReply(e.target.value)}
      />
      <button onClick={postReply}>Submit Reply</button>
    </div>
  );
};

export default ThreadPage;
