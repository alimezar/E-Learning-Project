'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '../components/NavBar';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

interface Thread {
  _id: string;
  title: string;
  content: string;
  courseId: string;
  userName: string;
}

interface Message {
  senderId: string;
  senderName: string;
  courseId: string;
  message: string;
  _id?: string;
  timestamp?: string;
}

const Forum = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId'); // Dynamically retrieve courseId from URL query params

  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newThread, setNewThread] = useState<{ title: string; content: string }>({
    title: '',
    content: '',
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  // Fetch threads by courseId
  const fetchThreads = async () => {
    if (!courseId) {
      setError('Course ID is missing. Please check the URL.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/threads/${courseId}`);
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
    if (!courseId) {
      alert('Error: Course ID is missing. Please check the URL.');
      return;
    }

    const cookies = document.cookie;
    const userCookie = cookies.split('; ').find((cookie) => cookie.startsWith('user='));
    if (!userCookie) {
      alert('You must be logged in to create a thread.');
      return;
    }

    const user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));

    const threadData = {
      title: newThread.title,
      content: newThread.content,
      courseId,
      userId: user.id,
    };

    const res = await fetch('http://localhost:3001/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(threadData),
    });

    if (res.ok) {
      setNewThread({ title: '', content: '' });
      fetchThreads();
    } else {
      const error = await res.json();
      console.error('Failed to create thread:', error);
      alert(`Failed to create thread: ${error.message}`);
    }
  };

  // Chat functionality
  useEffect(() => {
    if (!courseId) return;

    const cookies = document.cookie;
    const userCookie = cookies.split('; ').find((cookie) => cookie.startsWith('user='));
    if (userCookie) {
      const user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
      setUserName(user.name);
      setUserId(user.id);
    }

    // Fetch chat messages from the backend
    const fetchChatMessages = async () => {
      try {
        const res = await fetch(`http://localhost:3001/chat/${courseId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch chat messages');
        }
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchChatMessages();

    // Initialize WebSocket connection
    socket = io('http://localhost:3001', {
      transports: ['websocket'],
      query: { userId },
    });

    socket.on(`receiveMessage:${courseId}`, (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      if (socket) {
        socket.off(`receiveMessage:${courseId}`);
        socket.disconnect();
      }
    };
  }, [courseId, userId]);

  const handleSendMessage = () => {
    if (!socket || !newMessage.trim() || !courseId) return;

    socket.emit('sendMessage', {
      senderId: userId,
      senderName: userName,
      courseId,
      message: newMessage,
    });

    setNewMessage('');
  };

  const filteredThreads = threads.filter((thread) =>
    thread.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
    textarea: {
      width: '100%',
      padding: '12px',
      marginBottom: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '1em',
      boxSizing: 'border-box' as 'border-box',
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
    chatContainer: {
      marginTop: '40px',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    chatBox: {
      border: '1px solid #ccc',
      padding: '1rem',
      height: '300px',
      overflowY: 'scroll' as 'scroll',
      marginBottom: '10px',
    },
    chatInput: {
      width: 'calc(100% - 100px)',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      marginRight: '10px',
    },
    sendButton: {
      padding: '10px 20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <NavBar />
      <h1 style={styles.header}>Forum</h1>
  
      {/* Search Bar */}
      <div style={styles.formContainer}>
        <h2>Search Threads</h2>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
      </div>
  
      {/* Threads */}
      {loading && <p>Loading threads...</p>}
      {error && <p>{error}</p>}
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
        {filteredThreads.length > 0 ? (
          filteredThreads.map((thread) => (
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
          <p>No threads found matching your search.</p>
        )}
      </ul>
  
      {/* Study Group Chat */}
      <div style={styles.chatContainer}>
        <h2>Study Group Chat</h2>
        <div style={styles.chatBox}>
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>
                <strong>{msg.senderName || msg.senderId}:</strong> {msg.message}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={styles.chatInput}
          />
          <button onClick={handleSendMessage} style={styles.sendButton}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};  

export default Forum;
