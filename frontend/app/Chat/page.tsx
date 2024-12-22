'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

const parseCookies = () => {
  const cookieString = document.cookie;
  const cookies = cookieString.split('; ').reduce((acc, curr) => {
    const [key, value] = curr.split('=');
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {} as Record<string, string>);
  return cookies;
};

interface ChatPageProps {
  courseId?: string; // Optional courseId for 1-on-1 chats
}

const ChatPage: React.FC<ChatPageProps> = ({ courseId }) => {
  const [messages, setMessages] = useState<
    { senderId: string; senderName?: string; courseId?: string; message: string; _id?: string; timestamp?: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [userName, setUserName] = useState<string>(''); // Store the user's name
  const [userId, setUserId] = useState<string>(''); // Store the user's ID

  useEffect(() => {
    // Parse the user cookie to get the user's name and ID
    const cookies = parseCookies();
    if (cookies.user) {
      const user = JSON.parse(cookies.user);
      setUserName(user.name);
      setUserId(user.id); // Extract and set the user's ID
    }

    // Connect to the WebSocket server
    socket = io('http://localhost:3001', {
      transports: ['websocket'], // Use WebSocket transport
    });

    console.log('Socket initialized:', socket);

    // Listen for incoming messages
    if (courseId) {
      // Group chat: Listen to course-specific channel
      socket.on(`receiveMessage:${courseId}`, (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    } else {
      // 1-on-1 chat: Listen to user-specific channel
      socket.on(`receiveMessage:${userId}`, (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    // Clean up the connection when the component unmounts
    return () => {
      console.log('Disconnecting socket...');
      if (courseId) {
        socket.off(`receiveMessage:${courseId}`);
      } else {
        socket.off(`receiveMessage:${userId}`);
      }
      socket.disconnect();
    };
  }, [courseId, userId]);

  const sendMessage = () => {
    if (!socket) {
      console.error('Socket is not initialized!');
      return;
    }

    if (newMessage.trim()) {
      socket.emit('sendMessage', {
        senderId: userId,
        senderName: userName,
        courseId: courseId || null, // Include courseId if available, otherwise null for 1-on-1 chat
        message: newMessage,
      });
      setNewMessage('');
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <p>Logged in as: <strong>{userName}</strong></p>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '1rem',
          height: '300px',
          overflowY: 'scroll',
        }}
      >
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.senderName || msg.senderId}:</strong> {msg.message}
            </li>
          ))}
        </ul>
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
