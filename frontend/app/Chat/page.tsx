'use client';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

const ChatPage = () => {
  const [messages, setMessages] = useState<
    { senderId: string; receiverId: string; message: string; _id?: string; timestamp?: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    // Connect to the WebSocket server
    socket = io('http://localhost:3001', {
      transports: ['websocket'], // Use WebSocket transport
    });

    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('sendMessage', {
        senderId: '1', // Replace with the actual sender ID
        receiverId: '2', // Replace with the actual receiver ID
        message: newMessage,
      });
      setNewMessage('');
    }
  };

  return (
    <div>
      <h1>Chat</h1>
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
              <strong>{msg.senderId}:</strong> {msg.message}
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
