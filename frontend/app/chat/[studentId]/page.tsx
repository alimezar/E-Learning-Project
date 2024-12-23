'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

interface Message {
  senderId: string;
  senderName: string;
  courseId?: string; // Treat `studentId` as `courseId`
  message: string;
  _id?: string; // Unique identifier
  timestamp?: string;
}

const ChatPage = () => {
  const params = useParams();
  const rawStudentId = params?.studentId;
  const studentId = Array.isArray(rawStudentId) ? rawStudentId[0] : rawStudentId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [userName, setUserName] = useState<string>(''); // Current user's name
  const [userId, setUserId] = useState<string>(''); // Current user's ID
  const [isConnected, setIsConnected] = useState<boolean>(false); // Socket connection state

  useEffect(() => {
    const cookies = document.cookie;
    const userCookie = cookies.split('; ').find((cookie) => cookie.startsWith('user='));
    if (!userCookie) {
      console.error('User cookie not found. User may not be logged in.');
      return;
    }

    const user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
    setUserName(user.name || 'User');
    setUserId(user.id || '');

    if (!studentId) {
      console.error('Student ID is missing from the route.');
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:3001/chat/${studentId}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Initialize WebSocket connection
    socket = io('http://localhost:3001', {
      transports: ['websocket'],
      query: { userId: user.id }, // Pass userId during connection
    });

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('WebSocket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    });

    // Listen for incoming messages
    socket.on(`receiveMessage:${studentId}`, (message: Message) => {
      setMessages((prevMessages) => {
        if (prevMessages.some((msg) => msg._id === message._id)) {
          return prevMessages;
        }
        return [...prevMessages, message];
      });
    });

    return () => {
      if (socket) {
        socket.off(`receiveMessage:${studentId}`);
        socket.disconnect();
      }
    };
  }, [studentId]);

  const sendMessage = () => {
    if (!socket) {
      console.error('Socket is not initialized.');
      return;
    }

    if (!newMessage.trim() || !userId) {
      console.error('Cannot send message: missing required data.');
      return;
    }

    const messageData = {
      senderId: userId,
      senderName: userName,
      courseId: studentId, // Treat `studentId` as `courseId`
      message: newMessage,
    };

    console.log('Sending message:', messageData);

    socket.emit('sendMessage', messageData);

    setNewMessage(''); // Clear the input box
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
    chatHeader: {
      fontSize: '1.5em',
      color: '#333',
      textAlign: 'center' as 'center',
      marginBottom: '20px',
    },
    chatBox: {
      border: '1px solid #ccc',
      padding: '1rem',
      height: '300px',
      overflowY: 'scroll' as 'scroll',
      marginBottom: '10px',
      backgroundColor: '#fff',
      borderRadius: '8px',
    },
    inputContainer: {
      display: 'flex',
      gap: '10px',
    },
    input: {
      flexGrow: 1,
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    sendButton: {
      padding: '10px 20px',
      backgroundColor: isConnected ? '#4CAF50' : '#ccc', // Green if connected, gray if disconnected
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: isConnected ? 'pointer' : 'not-allowed',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.chatHeader}>Chat with Student</h1>
      <div style={styles.chatBox}>
        <ul>
          {messages.map((msg, index) => (
            <li key={msg._id || index}>
              <strong>{msg.senderName}:</strong> {msg.message}
            </li>
          ))}
        </ul>
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendButton} disabled={!isConnected}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
