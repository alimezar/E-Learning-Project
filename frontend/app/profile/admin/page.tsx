'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Log {
  type: 'failed_login' | 'unauthorized_access';
  message: string;
  ip: string;
  timestamp: string;
  email?: string;
  userId?: string;
}

export default function AdminDashboard() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://localhost:3001/logs', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }

        const data = await response.json();
        setLogs(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <div style={styles.buttonGroup}>
          <Link href="/profile/admin/users" style={styles.button}>
            View All Users
          </Link>
          <Link href="/profile/instructor/courses/view" style={styles.button}>
            View All Courses
          </Link>
        </div>
      </div>

      {error && <p style={styles.error}>Error: {error}</p>}

      <div style={styles.logs}>
        <h2>Failed Login Attempts & Unauthorized Access Logs</h2>
        {logs.length > 0 ? (
          <ul style={styles.logList}>
            {logs.map((log, index) => (
              <li key={index} style={styles.logItem}>
                <strong>{log.type}</strong>: {log.message} 
                {log.email && ` (Email: ${log.email})`} 
                (IP: {log.ip}) at {new Date(log.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.noLogs}>No logs available.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', fontFamily: 'Arial, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' },
  title: { fontSize: '2rem', fontWeight: 'bold' },
  buttonGroup: { display: 'flex', gap: '1rem' },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4c9aff',
    color: '#fff',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  error: { color: 'red', marginBottom: '1rem' },
  logs: { marginTop: '2rem' },
  logList: { listStyleType: 'none', padding: 0 },
  logItem: { marginBottom: '1rem', fontSize: '1rem', lineHeight: '1.5', color: '#333' },
  noLogs: { color: '#777', fontSize: '1rem', marginTop: '1rem' },
};
