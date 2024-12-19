'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import NavBar from '../components/NavBar';

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

const ChatPage = () => {
  const [messages, setMessages] = useState<
    { senderId: string; senderName?: string; receiverId: string; message: string; _id?: string; timestamp?: string }[]
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
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the connection when the component unmounts
    return () => {
      console.log('Disconnecting socket...');
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!socket) {
      console.error('Socket is not initialized!');
      return;
    }

    if (newMessage.trim()) {
      socket.emit('sendMessage', {
        senderId: userId,
        senderName: userName,
        receiverId: '2', // Replace with actual receiverId
        message: newMessage,
      });
      setNewMessage('');
    }
  };

  return (
    <div>
      <NavBar/>
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
